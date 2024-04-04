import PrivacyModel from '../models/Privacy.js';
import { getUserInformation } from './sessionController.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * GET:
 *  "/privacy" => getPrivacySettings(req, res) - gets the privacy settings of a user
 * POST:
 *  "/update_privacy" => updatePrivacySettings(req, res) - updates the privacy settings of a user
 */

export const getPrivacySettings = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const privacy = await PrivacyModel.findOne({ _id: data._id }).lean();
            return res.json({ authorized: true, privacySettings: privacy });
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
            let privacy = await PrivacyModel.findOne({ _id: data._id });
            if (!privacy) {
                privacy = new PrivacyModel({ _id: data._id });
            }
            privacy.publicProfile = req.body.publicProfile;
            privacy.birthdayPrivate = req.body.birthdayPrivate;
            privacy.aboutPrivate = req.body.aboutPrivate;
            privacy.linkedinLinkPrivate = req.body.linkedinLinkPrivate;
            await privacy.save();
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