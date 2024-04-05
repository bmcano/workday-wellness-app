import PrivacyModel from '../models/Privacy.js';
import { getUserInformation } from './sessionController.js';
import dotenv from 'dotenv';
dotenv.config();

export const getPrivacySettings = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const user = await PrivacyModel.findOne({ email: data.email }).lean();
            return res.json({ authorized: true, privacySettings: user });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.log(error);
        return res.json({ authorized: false });
    }
}

export const updatePrivacySettings = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const user = await PrivacyModel.findOne({ email: data.email });
            const user_data = req.body;
            for (let key in user_data) {
                if (user_data[key] !== null) {
                    user[key] = user_data[key];
                }
            }
            await user.save();
            return res.json({ success: true, message: "Privacy settings updated."});
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