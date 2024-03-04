import settings from '../graphApi/outlookSettings.js';
import * as graphHelper from '../graphApi/graphHelper.js';
import UserModel from '../models/Users.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Job: Backend API for any calls related to the Microsoft Graph API.
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

export const checkIfOutlookClientExist = (req, res) => {
    const result = graphHelper.checkIfClientExist(req.session._id);
    return res.json({ authorized: result });
}

export const initalizeOutlookClient = async (req, res) => {
    try {
        graphHelper.initializeGraphForUserAuth(req.session._id, settings, (deviceCodeMessage) => {
            console.log(deviceCodeMessage);
            return res.json({ authorized: true, deviceCodeMessage: deviceCodeMessage });
        });
        // we need to call this in order to be able to return the device code message for the user to authenticate
        await graphHelper.getUserAsync(req.session._id);
    } catch (error) {
        console.log(error);
        if (error.code === 'AuthenticationRequiredError') {
            console.log("User did not log into outlook");
        }
        // intionally omitted the return statment as it crashes server if the user does not login after return in the try block
    }
}

export const getOutlookCalendar = async (req, res) => {
    try {
        const user = await graphHelper.getUserAsync(req.session._id);
        const email = user.mail;
        const calendar = await graphHelper.getCalendarAysnc(req.session._id, email, req.body);
        return res.json({ authorized: true, calendar: calendar });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: "Error connecting to Outlook." });
    }
}

export const getCalendarData = async (req, res) => {
    try {
        const user = await UserModel.findById(req.session._id);
        const calendar = user.calendar;
        return res.json({ success: true, calendar: calendar });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: "Internal server error." });
    }
}

export const saveCalendarData = async (req, res) => {
    try {
        const user = await UserModel.findById(req.session._id);
        user.calendar = req.body.calendar;
        console.log(user.calendar)
        await user.save();
        return res.json({ success: true });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: "Internal server error." });
    }
}

export const addCalendarData = async (req, res) => {
    try {
        const user = await UserModel.findById(req.session._id);
        user.calendar.push(req.body.event);
        await user.save();
        return res.json({ success: true });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: "Internal server error." });
    }
}

export const addOutlookEvent = async (req, res) => {
    try {
        const user = await graphHelper.getUserAsync(req.session._id);
        const email = user.mail;
        const name = user.displayName;
        const calendar = await graphHelper.addOutlookEvent(req.session._id, email, name, req.body.event);
        return res.json({ authorized: true, calendar: calendar });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: "Error connecting to Outlook." });
    }
}

export const addUserRecommendations = async (req, res) => {
    async function addToDatabase(req) {
        try {
            const user = await UserModel.findById(req.session._id);
            user.calendar.push(...req.body.events);
            await user.save();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async function addToOutlook(req) {
        try {
            const user = await graphHelper.getUserAsync(req.session._id);
            const email = user.mail;
            const name = user.displayName;
            req.body.events.forEach(async (event) => {
                await graphHelper.addOutlookEvent(req.session._id, email, name, event);
            })
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const db = addToDatabase(req);
    const outlook = addToOutlook(req);
    if (!db || !outlook) {
        return res
            .status(400)
            .json({ error: "Error saving to database or outlook" });
    }

    return res.json({ success: true });
}