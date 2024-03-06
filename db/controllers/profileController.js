import UserModel from '../models/Users.js';
import { getUserInformation } from './sessionController.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * GET:
 *  "/user" => getUser(req, res) - gets all items of a user thats in the users document from their unique id
 * POST:
 *  "/upload" => uploadProfilePicture(req, res) - updates the profile picture in the database
 *  "/update_exercise_information" => updateExerciseInformation(req, res) - updates all the exercises preferences
 */

export const getUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const user = await UserModel.findOne({ _id: data._id }).lean();
            return res.json({ authorized: true, user: user });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.log(error);
        return res.json({ authorized: false });
    }
}

export const uploadProfilePicture = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const user = await UserModel.findOne({ _id: data._id });
            const base64Image = req.body.base64Image;
            user.profile_picture = base64Image;
            await user.save();
            return res.json({ success: true });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("Error uploading picture.");
    }
}

export const updateExerciseInformation = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const user = await UserModel.findOne({ _id: data._id });
            user.exercises = req.body.exerciseData;
            await user.save();
            return res.json({ success: true });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("Error saving exercise information.");
    }
}
