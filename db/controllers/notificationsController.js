import UserModel from '../models/Users.js';
import { getUserInformation } from './sessionController.js';
import { createNotification } from '../services/notificationService.js';
import NotificationsModel from '../models/Notifications.js';
import StatisticsModel from '../models/Statistics.js';

/**
 * GET:
 *  "/notifications" => getNotifications(req, res) - will get the list of all the users notifications
 *  "/todays_events" => getTodaysEvents(req, res) - will get the list of events for the current day
 * POST:
 *  "/notification_exercise_update" => updateExerciseStats(req, res) - will update the users stats from the notification
 *  "/notification_friend_update" => createFriendRequestNotification(req, res) - will update the users friends list from the notificaiton (accepting request)
 *  "/dismiss_notification" => dismissNotification(req, res) - will remove the notification from the list
 *  "/friend_request_sent" => friendRequestSent(req, res) - will check if the friend request was sent for a user looking at a profile
 *  "/cancel_friend_request" => cancelFriendRequest(req, res) - will cancel a sent request to a user
 */

export const getNotifications = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const notifications = await NotificationsModel.find({ email: data.email }).lean();
            return res.json({ authorized: true, notifications: notifications.filter(item => !item.isRead) });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.log(error);
        return res.json({ authorized: false });
    }
}

export const getTodaysEvents = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const user = await UserModel.findOne({ _id: data._id });
            // get today's date in YYYY-MM-DD format (CST)
            const now = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', hour12: false });
            const today = now.split(',')[0];
            const events = user.calendar.filter(event => {
                const eventStart = new Date(event.start).toLocaleString('en-US', { timeZone: 'America/Chicago', hour12: false }).split(',')[0];
                const eventEnd = new Date(event.end).toLocaleString('en-US', { timeZone: 'America/Chicago', hour12: false }).split(',')[0];
                return eventStart <= today && eventEnd >= today && event.isExercise;
            });
            // will check if an item has already occurred or not
            events.map(async (event) => {
                const eventStart = new Date(event.start).toLocaleString('en-US', { timeZone: 'America/Chicago', hour12: false });
                if (eventStart <= now && !event.hasOccurred) {
                    await UserModel.updateOne(
                        { _id: user._id, 'calendar._id': event._id },
                        { $set: { 'calendar.$.hasOccurred': true } }
                    );
                    createNotification(data._id, data.email, event.title, "If completed mark as complete, otherwise dismiss it.", true, "exercise");
                }
            })

            return res.json({ authorized: true, events: events });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.log(error);
        return res.json({ authorized: false });
    }
}

export const updateExerciseStats = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const stats = await StatisticsModel.findOne({ email: data.email });
            // update amount and completed part
            stats.completed.amount = stats.completed.amount + 1;
            stats.completed.exercises.push({ exercise: req.body.exercise, timestamp: new Date() });
            // check streak
            const lastCompleted = stats.lastCompleted;
            const today = new Date();
            const isSameDay = lastCompleted && lastCompleted.getFullYear() === today.getFullYear() &&
                lastCompleted.getMonth() === today.getMonth() &&
                lastCompleted.getDate() === today.getDate();

            if (!isSameDay) {
                // If last completed is not today, check for missed days
                const sortedExercises = stats.completed.exercises.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                let streak = 0;
                for (let i = 0; i < sortedExercises.length - 1; i++) {
                    const current = new Date(sortedExercises[i].timestamp);
                    const next = new Date(sortedExercises[i + 1].timestamp);
                    const timeDiff = next.getTime() - current.getTime();
                    const daysDiff = timeDiff / (1000 * 3600 * 24);
                    if (daysDiff > 1.5) {
                        // reset streak if there's a gap larger than 36 hours
                        streak = 0;
                        break;
                    }
                    streak++;
                }
                stats.streak = streak + 1;
                stats.lastCompleted = new Date();
            }
            await stats.save();
            return res.json({ authorized: true });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.log(error);
        return res.json({ authorized: false });
    }
}

export const createFriendRequestNotification = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const user = await UserModel.findById(data._id);
            if (!user) return res.json({ authorized: false });
            const friend = await UserModel.findById(req.body.friend_id);
            if (!friend) return res.json({ authorized: false });
            createNotification(friend._id, friend.email, "Friend Request", `${user.first_name} ${user.last_name} has sent you a friend request.`, true, "friend", data._id);
            return res.json({ authorized: true });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.log(error);
        return res.json({ authorized: false });
    }
}

export const dismissNotification = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const notification = await NotificationsModel.findById(req.body._id);
            notification.isRead = true;
            await notification.save();
            return res.json({ authorized: true });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.log(error);
        return res.json({ authorized: false });
    }
}

export const friendRequestSent = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const notification = await NotificationsModel.findOne({ userId: req.body._id, title: 'Friend Request', other: data._id, isRead: false }).lean();
            console.log(notification)
            if (notification) return res.json({ authorized: true, requestSent: true });
            return res.json({ authorized: true, requestSent: false });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.log(error);
        return res.json({ authorized: false });
    }
}

export const cancelFriendRequest = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const notification = await NotificationsModel.findOne({ userId: req.body.friend_id, title: 'Friend Request', other: data._id });
            if (notification) {
                notification.isRead = true;
                notification.markModified('isRead');
                await notification.save();
            }
            return res.json({ authorized: true });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.log(error);
        return res.json({ authorized: false });
    }
}
