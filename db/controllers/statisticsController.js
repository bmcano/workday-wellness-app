import AchievementsModel from "../models/Achievements.js";
import StatisticsModel from "../models/Statistics.js";
import UserModel from "../models/Users.js";
import { getUserInformation } from "./sessionController.js";

/**
 * GET:
 *  "/get_global_leaderboard_streak" => getGlobalLeaderboardStreak(req, res) - grabs the list of all users and sorts them by streak count
 *  "/get_global_leaderboard_completed" => getGlobalLeaderboardCompleted(req, res) - grabs the list of all users and sorts them by completed items
 *  "/get_friend_leaderboard_streak" => getFriendLeaderboardStreak(req, res) - grabs the list of all friends of the user and sorts them by streak count
 *  "/get_friend_leaderboard_completed" => getFriendLeaderboardCompleted(req, res) - grabs the list of all friends of the user and sorts them by completed items
 *  "/get_user_records" => getUserRecords(req, res) - gets the stats of the user
 * POST: "/update_user_achievements" => updateUserAchievement(req, res) - updates user achievements based on their current streak and completed items
 */

export const getGlobalLeaderboardStreak = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const userEmail = data.email;
            const user = await StatisticsModel.findOne({ email: userEmail }).lean();
            const users = await StatisticsModel.find({}).sort({ streak: -1 }).lean();
            const leaderboard = users.map((users, index) => ({ ...users, placement: index + 1 }));
            const userPlacement = leaderboard.find(entry => entry.email === userEmail)?.placement || null;
            return res.json({ authorized: true, leaderboard: leaderboard, user: { ...user, placement: userPlacement } });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.log(error);
        return res.json({ authorized: false });
    }
}

export const getGlobalLeaderboardCompleted = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const userEmail = data.email;
            const user = await StatisticsModel.findOne({ email: userEmail }).lean();
            const users = await StatisticsModel.find({}).sort({ "completed.amount": -1 }).lean();
            const leaderboard = users.map((users, index) => ({ ...users, placement: index + 1 }));
            const userPlacement = leaderboard.find(entry => entry.email === userEmail)?.placement || null;
            return res.json({ authorized: true, leaderboard: leaderboard, user: { ...user, placement: userPlacement } });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.log(error);
        return res.json({ authorized: false });
    }
}

export const getFriendLeaderboardStreak = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const userEmail = data.email;
            const userWithFriends = await UserModel.findOne({ email: userEmail }).lean();
            if (!userWithFriends || !userWithFriends.friends) {
                console.log("No friends found for user:", userEmail);
                userWithFriends.friends = [];
            }

            const userFriends = [...userWithFriends.friends, userEmail];
            const friendsLeaderboard = await StatisticsModel
                .find({ email: { $in: userFriends } })
                .sort({ streak: -1 })
                .lean();

            const leaderboard = friendsLeaderboard.map((user, index) => ({
                ...user,
                placement: index + 1
            }));

            const userPlacement = leaderboard.findIndex(entry => entry.email === userEmail) + 1;
            return res.json({ authorized: true, leaderboard: leaderboard, user: { ...data, placement: userPlacement } });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.log(error);
        return res.json({ authorized: false });
    }
}

export const getFriendLeaderboardCompleted = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const userEmail = data.email;
            const userWithFriends = await UserModel.findOne({ email: userEmail }).lean();
            if (!userWithFriends || !userWithFriends.friends) {
                userWithFriends.friends = [];
            }

            const userFriends = [...userWithFriends.friends, userEmail];
            const friendsLeaderboard = await StatisticsModel
                .find({ email: { $in: userFriends } })
                .sort({ "completed.amount": -1 })
                .lean();

            const leaderboard = friendsLeaderboard.map((user, index) => ({
                ...user,
                placement: index + 1
            }));

            const userPlacement = leaderboard.findIndex(entry => entry.email === userEmail) + 1;
            return res.json({ authorized: true, leaderboard: leaderboard, user: { ...data, placement: userPlacement } });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.log(error);
        return res.json({ authorized: false });
    }
}

export const getUserRecords = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const userEmail = data.email;
            const userStats = await StatisticsModel.findOne({ email: userEmail }, 'email streak completed.amount').lean();
            if (!userStats) {
                return res.json({ authorized: true, message: "User statistics not found." });
            }

            return res.json({
                authorized: true,
                user: {
                    name: data.name,
                    streak: userStats.streak,
                    completedExercises: userStats.completed.amount,
                },
            });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.log(error);
        return res.json({ authorized: false, error: "An error occurred while fetching user records." });
    }
};

export const updateUserAchievement = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const userInfo = getUserInformation(token);

        if (!userInfo) {
            return res.status(401).json({ authorized: false, message: "Unauthorized access." });
        }

        const userEmail = userInfo.email;
        const userStats = await StatisticsModel.findOne({ email: userEmail }).lean();
        const userWithFriends = await UserModel.findOne({ email: userEmail }).lean();

        if (!userStats) {
            return res.status(404).json({ message: "User statistics not found." });
        }

        let userAchievements = await AchievementsModel.findOne({ email: userEmail });

        // Create a new achievements document if it does not exist
        if (!userAchievements) {
            userAchievements = new AchievementsModel({
                email: userEmail,
                MadeFriend: false,
                OneDayStreak: false,
                TenDayStreak: false,
                HundredDayStreak: false,
                OneDayEx: false,
                TenDayEx: false,
                HundredDayEx: false
            });
        }

        userAchievements.MadeFriend = userWithFriends && userWithFriends.friends && userWithFriends.friends.length > 0;
        userAchievements.OneDayStreak = userAchievements.OneDayStreak || userStats.streak >= 1;
        userAchievements.TenDayStreak = userAchievements.TenDayStreak || userStats.streak >= 10;
        userAchievements.HundredDayStreak = userAchievements.HundredDayStreak || userStats.streak >= 100;

        userAchievements.OneDayEx = userAchievements.OneDayEx || userStats.completed.amount >= 1;
        userAchievements.TenDayEx = userAchievements.TenDayEx || userStats.completed.amount >= 10;
        userAchievements.HundredDayEx = userAchievements.HundredDayEx || userStats.completed.amount >= 100;

        await userAchievements.save();

        res.json({ authorized: true, message: "Achievements updated successfully.", achievements: userAchievements });
    } catch (error) {
        console.error("Error updating achievements:", error);
        res.status(500).json({ authorized: false, error: "An error occurred while updating achievements." });
    }
};


export const getUserAchievements = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);

        if (data) {
            console.log(data)
            const achivemenent = await AchievementsModel.findOne({ email: data.email });
            console.log({email: data.email});
            if (achivemenent) {
                return res.json({ authorized: true, achievements: achivemenent });
            }
            return res.json({ authorized: false });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("Error getting privacy settings.");
    }
};

export const viewingUserAchievements = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const user_id = req.body; 
            const user = await UserModel.findOne({ _id: user_id }).lean();
            const achievements = await AchievementsModel.findOne({ email: user.email });

            if (!user || !achievements) {
                return res
                    .status(404)
                    .json({ authorized: true, error: "User or achievements not found" });
            }

            return res.json({ authorized: true, achievements: achievements });
        } else {
            return res.status(401).json({ authorized: false, error: "Unauthorized" });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ authorized: false, error: "Internal Server Error" });
    }
};