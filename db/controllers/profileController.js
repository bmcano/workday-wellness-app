import UserModel from '../models/Users.js';
import { getUserInformation } from './sessionController.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

/**
 * GET:
 *  "/user" => getUser(req, res) - gets all items of a user thats in the users document from their unique id
 * POST:
 *  "/upload" => uploadProfilePicture(req, res) - updates the profile picture in the database
 *  "/update_exercise_information" => updateExerciseInformation(req, res) - updates all the exercises preferences
 *  "/does_email_exist" => doesEmailExistInDatabase(req, res) - checks if an email is in the DB
 *  "/send_email" => sendEmail(req, res) - sends an email to a user given a email
 *  "/reset_password" => resetPassword(req, res) - updates a user password 
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
            console.log('Email sent: ' + info.response);
            return res.json({ success: true });
        }
    });
}

export const resetPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await UserModel.findOne({ email: email });
        const plainTextPassword = user.password;
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