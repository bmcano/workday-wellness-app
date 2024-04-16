import PrivacyModel from '../models/Privacy.js';
import UserModel from '../models/Users.js';
import { getUserInformation } from './sessionController.js';
import dotenv from 'dotenv';
dotenv.config();

export const getPrivacySettings = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const privacy = await PrivacyModel.findOne({ email: data.email });
            if (privacy) {
                return res.json({ authorized: true, privacySettings: privacy });
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
}

export const updatePrivacySettings = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const privData = req.body;
            const privacy = await PrivacyModel.findOne({ email: data.email });
            if (privacy) {
                privacy.publicProfile = privData.publicProfile;
                privacy.birthday = privData.birthdayPrivate;
                privacy.about = privData.aboutPrivate;
                privacy.linkedinLink = privData.linkedinLinkPrivate;
                privacy.status = privData.statusPrivate;
                privacy.achievements = privData.achievementsPrivate;
                await privacy.save();
            } else {
                const new_privacy = new PrivacyModel({
                    email: data.email,
                    publicProfile: privData.publicProfile,
                    birthday: privData.birthdayPrivate,
                    about: privData.aboutPrivate,
                    linkedinLink: privData.linkedinLinkPrivate,
                    status: privData.statusPrivate,
                    achievements: privData.achievementsPrivate
                })
                await new_privacy.save();
            }
            return res.json({ success: true });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("Error updating privacy settings.");
    }
}

export const getUserPrivacy = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const user_id = req.body;
            const user = await UserModel.findOne({ _id: user_id }).lean();
            const privacy = await PrivacyModel.findOne({ email: user.email });
            if (!user || !privacy) {
                return res
                    .status(404)
                    .json({ error: "User not found or privacy settings not found" });
            }
            return res.json({ authorized: true, privacySettings: privacy });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "Internal Server Error" });
    }
};
