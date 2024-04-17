import UserModel from '../models/Users.js';
import { getUserInformation } from './sessionController.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * GET:
 *  "/users_list" => usersList(req, res) - gets a list of all the users with the exception of the user logged in
 *  "/friends_list" => friendsList(req, res) - gets a list of all the users in the logged in users friend list
 * POST:
 *  "/view_profile" => viewUserProfile(req, res) - will send a public user id and retrieve the user data to display their data publicly
 *  "/add_friend" => addFriend(req, res) - will send user ids and properly update database items to add a friend
 *  "/remove_friend" => removeFriend(req, res) - will send user ids and properly update database items to remove a friend
 */

export const usersList = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const user = await UserModel.findOne({ _id: data._id }).lean();
            const email = user.email;
            const users = await UserModel.find({});
            const stub = users.filter(item => item.email !== email).map(friend => {
                return {
                    id: friend._id.toString(),
                    first_name: friend.first_name,
                    last_name: friend.last_name,
                    profile_picture: friend.profile_picture,
                    isFriend: user.friends.includes(friend.email)
                };
            });
            return res.json(stub);
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "Internal Server Error" });
    }
}

export const friendsList = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const user = await UserModel.findOne({ _id: data._id }).lean();
            const friendsEmails = user.friends;
            const friendsDetails = await UserModel.find({ email: { $in: friendsEmails } }).lean();
            const stub = friendsDetails.map(friend => {
                return {
                    id: friend._id.toString(),
                    first_name: friend.first_name,
                    last_name: friend.last_name,
                    profile_picture: friend.profile_picture
                };
            });
            return res.json(stub);
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "Internal Server Error" });
    }
}

export const viewUserProfile = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const user_id = req.body;
            const user = await UserModel.findOne({ _id: user_id }).lean();
            const auth_user = await UserModel.findOne({ _id: data._id }).lean();
            if (!user || !auth_user) {
                return res
                    .status(404)
                    .json({ error: "User not found" });
            }
            return res.json({ user: user, auth_user: auth_user });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "Internal Server Error" });
    }
}

export const addFriend = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (!data) return res.json({ authorized: false });
        const { friend_id } = req.body;
        const user = await UserModel.findById(data._id)
        const friend = await UserModel.findById(friend_id)
        if (!user || !friend) {
            return res
                .status(404)
                .json({ error: "User or friend not found" });
        }
        user.friends.push(friend.email);
        friend.friends.push(user.email);
        await user.save();
        await friend.save();
        return res.json({ isFriend: true, message: "Friend added successfully." });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "Internal Server Error" });
    }
}

export const removeFriend = async (req, res) => {
    try {
        const { user_id, friend_id } = req.body;
        const user = await UserModel.findById(user_id)
        const friend = await UserModel.findById(friend_id)
        if (!user || !friend) {
            return res
                .status(404)
                .json({ error: "User or friend not found" });
        }
        user.friends = user.friends.filter(item => item !== friend.email);
        friend.friends = friend.friends.filter(item => item !== user.email);
        await user.save();
        await friend.save();
        return res.json({ isFriend: false, message: "Friend removed successfully." });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "Internal Server Error" });
    }
}
