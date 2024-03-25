import StatisticsModel from "../models/Statistics.js";
import UserModel from "../models/Users.js";
import { getUserInformation } from "./sessionController.js";

/**
 * GET:
 *  "/get_global_leaderboard_streak" => getGlobalLeaderboardStreak(req, res) - grabs the list of all users and sorts them by streak count
 *  "/get_global_leaderboard_completed" => getGlobalLeaderboardCompleted(req, res) - grabs the list of all users and sorts them by completed items
 *  "/get_friend_leaderboard_streak" => getFriendLeaderboardStreak(req, res) - grabs the list of all friends of the user and sorts them by streak count
 *  "/get_friend_leaderboard_completed" => getFriendLeaderboardCompleted(req, res) - grabs the list of all friends of the user and sorts them by completed items
 * POST:
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
            //console.log("User and friends list for leaderboard:", userFriends);

            const friendsLeaderboard = await StatisticsModel
                .find({ email: { $in: userFriends } })
                .sort({ streak: -1 }) 
                .lean();

            //console.log("Friends and user streak leaderboard data:", friendsLeaderboard);

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
        console.log("Error in getFriendLeaderboardStreak:", error);
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
                //console.log("No friends found for user:", userEmail);
                userWithFriends.friends = [];
            }

            const userFriends = [...userWithFriends.friends, userEmail];
            const friendsLeaderboard = await StatisticsModel
                .find({ email: { $in: userFriends } })
                .sort({ "completed.amount": -1 }) 
                .lean();

            //console.log("Friends and user completed exercises leaderboard data:", friendsLeaderboard);

            const leaderboard = friendsLeaderboard.map((user, index) => ({
                ...user,
                placement: index + 1 
            }));

            const userPlacement = leaderboard.findIndex(entry => entry.email === userEmail) + 1;
            console.log(userPlacement)

            return res.json({ authorized: true, leaderboard: leaderboard, user: { ...data, placement: userPlacement } });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.log("Error in getFriendLeaderboardCompleted:", error);
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
        console.log("Error in getUserRecords:", error);
        return res.json({ authorized: false, error: "An error occurred while fetching user records." });
    }
};
