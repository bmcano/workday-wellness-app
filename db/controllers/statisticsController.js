import StatisticsModel from "../models/Statistics.js";
import { getUserInformation } from "./sessionController.js";

/**
 * GET:
 *  "/get_global_leaderboard_streak" => getGlobalLeaderboardStreak(req, res)
 *  "/get_global_leaderboard_completed" => getGlobalLeaderboardCompleted(req, res)
 *  "/get_friend_leaderboard_streak" => getFriendLeaderboardStreak(req, res)
 *  "/get_friend_leaderboard_completed" => getFriendLeaderboardCompleted(req, res)
 * POST:
 *
 */

export const getGlobalLeaderboardStreak = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const user = await StatisticsModel.findOne({ email: data.email }).lean();
            const users = await StatisticsModel.find({}).sort({ streak: -1 }).lean();
            const leaderboard = users.map((users, index) => ({ ...users, placement: index + 1 }));
            return res.json({ authorized: true, leaderboard: leaderboard, user: user });
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
            const user = await StatisticsModel.findOne({ email: data.email }).lean();
            const users = await StatisticsModel.find({}).sort({ "completed.amount": -1 }).lean();
            const leaderboard = users.map((users, index) => ({ ...users, placement: index + 1 }));
            return res.json({ authorized: true, leaderboard: leaderboard, user: user });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.log(error);
        return res.json({ authorized: false });
    }
}

export const getFriendLeaderboardStreak = async (req, res) => {

}

export const getFriendLeaderboardCompleted = async (req, res) => {

}