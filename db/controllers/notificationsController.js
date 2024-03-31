import NotificationsModel from '../models/Users.js';
import { getUserInformation } from './sessionController.js';

/**
 * GET:
 *  "/notifications" => getNotifications(req, res) - will get the list of all the users notifications
 * POST:
 *  "/notification_exercise_update" => updateExerciseStats(req, res) - will update the users stats from the notification
 *  "/notification_friend_update" => updateFriendsList(req, res) - will update the users friends list from the notificaiton (accepting request)
 *  "/dismiss_notification" => dismissNotification(req, res) - will remove the notification from the list
 */

export const getNotifications = async (req, res) => {

}

export const updateExerciseStats = async (req, res) => {
    
}

export const updateFriendsList = async (req, res) => {
    
}

export const dismissNotification = async (req, res) => {
    
}
