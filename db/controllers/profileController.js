import UserModel from '../models/Users.js';
import { getUserInformation } from './sessionController.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import ScheduleModel from '../models/Schedule.js';
dotenv.config();

/**
 * GET:
 *  "/user" => getUser(req, res) - gets all items of a user thats in the users document from their unique id
 *  "/schedule" getScheduleInformation(req, res) - gets the users schedule if it is different from the default
 * POST:
 *  "/upload" => uploadProfilePicture(req, res) - updates the profile picture in the database
 *  "/update_exercise_information" => updateExerciseInformation(req, res) - updates all the exercises preferences
 *  "/does_email_exist" => doesEmailExistInDatabase(req, res) - checks if an email is in the DB
 *  "/send_email" => sendEmail(req, res) - sends an email to a user given a email
 *  "/reset_password" => resetPassword(req, res) - updates a user password 
 *  "/set_token" => setToken(req, res) - sets the token in the users DB for when trying to reset a password
 *  "/clear_token" => clearToken(req, res) - clears the token associated with the user to prevent potential attacks
 *  "/get_email_from_token" => getEmailFromToken(req, res) - gets user email that is trying to reset password
 *  "/update_profile_information" => updateProfileInformation(req, res) - updates profile values
 *  "/update_schedule_information" => updateScheduleInformation(req, res) - updates schedule values
 */

// NODEMAILER CONFIG
// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'workdaywellnes@outlook.com',
        pass: process.env.REACT_APP_EMAIL_PASSWORD
    }
});

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

export const doesEmailExistInDatabase = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await UserModel.findOne({ email: email });
        if (user) {
            return res.json({ success: true });
        }
        return res.json({ success: false });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("Error searching for user email");
    }
}

export const sendEmail = async (req, res) => {
    let mailOptions = {
        from: 'workdaywellnes@outlook.com',
        to: req.body.email,
        subject: req.body.subject,
        text: req.body.text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Error sending email." });
        } else {
            return res.json({ success: true });
        }
    });
}

export const resetPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await UserModel.findOne({ email: email });
        const plainTextPassword = req.body.password;
        const password = await bcrypt.hash(plainTextPassword, 10);
        user.password = password;
        await user.save();
        return res.json({ success: true });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("Error saving exercise information.");
    }
}

export const setToken = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await UserModel.findOne({ email: email });
        user.password_reset = req.body.token;
        await user.save();
        return res.json({ success: true });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("Error searching for user email");
    }
}

export const clearToken = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await UserModel.findOne({ email: email });
        user.password_reset = undefined;
        await user.save();
        return res.json({ success: true });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("Error searching for user email");
    }
}

export const getEmailFromToken = async (req, res) => {
    try {
        const token = req.body.token;
        const user = await UserModel.findOne({ password_reset: token });
        if (user) {
            return res.json({ success: true, email: user.email });
        }
        return res.json({ success: false });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("Error searching for user email");
    }
}

export const updateProfileInformation = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const user = await UserModel.findOne({ _id: data._id });
            const user_data = req.body;
            for (let key in user_data) {
                if (user_data[key] !== "") {
                    user[key] = user_data[key];
                }
            }
            await user.save();
            return res.json({ success: true });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("Error updating profile information.");
    }
}

export const getScheduleInformation = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const schedule = await ScheduleModel.findOne({ email: data.email });
            if (schedule) {
                return res.json({ authorized: true, schedule: schedule });
            }
            return res.json({ authorized: false });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("Error updating profile information.");
    }
}

export const updateScheduleInformation = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const sData = req.body;
            const schedule = await ScheduleModel.findOne({ email: data.email });
            if (schedule) {
                schedule.monday_start = sData.monday_start,
                    schedule.monday_end = sData.monday_end,
                    schedule.tuesday_start = sData.tuesday_start,
                    schedule.tuesday_end = sData.tuesday_end,
                    schedule.wednesday_start = sData.wednesday_start,
                    schedule.wednesday_end = sData.wednesday_end,
                    schedule.thursday_start = sData.thursday_start,
                    schedule.thursday_end = sData.thursday_end,
                    schedule.friday_start = sData.friday_start,
                    schedule.friday_end = sData.friday_end,
                    await schedule.save();
            } else {
                const new_schedule = new ScheduleModel({
                    email: data.email,
                    monday_start: sData.monday_start,
                    monday_end: sData.monday_end,
                    tuesday_start: sData.tuesday_start,
                    tuesday_end: sData.tuesday_end,
                    wednesday_start: sData.wednesday_start,
                    wednesday_end: sData.wednesday_end,
                    thursday_start: sData.thursday_start,
                    thursday_end: sData.thursday_end,
                    friday_start: sData.friday_start,
                    friday_end: sData.friday_end,
                })
                await new_schedule.save();
            }
            return res.json({ success: true });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .send("Error updating schedule information.");
    }
}