import UserModel from '../models/Users.js';

/**
 * Job: Backend API calls regarding anything for friends/other users that is public
 */

export const searchUsersList = async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.session._id }).lean();
        if (!user) {
            return res
                .status(404)
                .json({ error: "User not found" });
        }

        const email = user.email;
        const users = await UserModel.find({});
        const stub = users.filter(item => item.email !== email).map(friend => {
            return {
                id: friend._id.toString(),
                first_name: friend.first_name,
                last_name: friend.last_name,
                profile_picture: friend.profile_picture
            };
        });

        return res.json(stub);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "Internal Server Error" });
    }
}

export const searchFriendsList = async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.session._id }).lean();
        if (!user) {
            return res
                .status(404)
                .json({ error: "User not found" });
        }

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
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "Internal Server Error" });
    }
}

export const viewUserProfile = async (req, res) => {
    try {
        const user_id = req.body;
        const user = await UserModel.findOne({ _id: user_id }).lean();
        const auth_user = await UserModel.findOne({ _id: req.session._id }).lean();
        if (!user || !auth_user) {
            return res
                .status(404)
                .json({ error: "User not found" });
        }
        const email = user.email;
        const first_name = user.first_name;
        const last_name = user.last_name;
        const profile_picture = user.profile_picture;
        return res.json({ email: email, first_name: first_name, last_name: last_name, profile_picture: profile_picture, auth_user: auth_user });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "Internal Server Error" });
    }
}

export const addFriend = async (req, res) => {
    try {
        const { user_id, friend_id } = req.body;
        const user = await UserModel.findById(user_id)
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
