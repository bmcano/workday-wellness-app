import settings from '../graphApi/outlookSettings.js';
import * as graphHelper from '../graphApi/graphHelper.js';
import UserModel from '../models/Users.js';
import nodemailer from 'nodemailer';
import { getUserInformation } from './sessionController.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * GET:
 *  "/check_outlook_client" => checkIfOutlookClientExist(req, res) - will validate with outlook to see if a user logged in
 *  "/initalize_outlook" => initalizeOutlookClient(req, res) - creates the outlook client
 *  "/get_calendar_data" => getCalendarData(req, res) - gets the calendar data from database
 * POST:
 *  "/sync_calendar" => getOutlookCalendar(req, res) - grabs the calendar payload from outlook for a specified date range
 *  "/save_calendar_data" => saveCalendarData(req, res) - saves the calendar data to the users database
 *  "/send_email" => sendEmail(req, res) - sends an email to a user given a email (NOT IMPLEMENTED)
 *  "/add_calendar_data" => addCalendarData(req, res) - adds an individual event to the database
 *  "/add_outlook_event" => addOutlookEvent(req, res) - adds an individual event to outlook
 *  "/add_user_recommendations" => addUserRecommendations(req, res) - adds the set of events to both the database and outlook
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
    const token = req.headers.authorization.split(' ')[1];
    const data = getUserInformation(token);
    if (data) {
        const result = graphHelper.checkIfClientExist(data._id);
        return res.json({ authorized: result });
    } else {
        return res.json({ authorized: false });
    }
}

export const initalizeOutlookClient = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            graphHelper.initializeGraphForUserAuth(data._id, settings, (deviceCodeMessage) => {
                console.log(deviceCodeMessage);
                return res.json({ authorized: true, deviceCodeMessage: deviceCodeMessage });
            });
            // we need to call this in order to be able to return the device code message for the user to authenticate
            await graphHelper.getUserAsync(data._id);
        }
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
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const user = await graphHelper.getUserAsync(data._id);
            const email = user.mail;
            const calendar = await graphHelper.getCalendarAysnc(data._id, email, req.body);
            return res.json({ authorized: true, calendar: calendar });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: "Error connecting to Outlook." });
    }
}

export const getCalendarData = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const user = await UserModel.findOne({ _id: data._id }).lean();
            const calendar = user.calendar;
            return res.json({ authorized: true, calendar: calendar });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: "Internal server error." });
    }
}

export const saveCalendarData = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const user = await UserModel.findOne({ _id: data._id });
            user.calendar = req.body.calendar;
            console.log(user.calendar)
            await user.save();
            return res.json({ success: true });
        } else {
            return res.json({ success: false });
        }
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: "Internal server error." });
    }
}

export const addCalendarData = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const user = await UserModel.findOne({ _id: data._id });
            user.calendar.push(req.body.event);
            await user.save();
            return res.json({ success: true });
        } else {
            return res.json({ success: false });
        }
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: "Internal server error." });
    }
}

export const addOutlookEvent = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = getUserInformation(token);
        if (data) {
            const user = await graphHelper.getUserAsync(data._id);
            const email = user.mail;
            const name = user.displayName;
            const calendar = await graphHelper.addOutlookEvent(data._id, email, name, req.body.event);
            return res.json({ authorized: true, calendar: calendar });
        } else {
            return res.json({ authorized: false });
        }
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: "Error connecting to Outlook." });
    }
}

export const addUserRecommendations = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const data = getUserInformation(token);
    let user_id = undefined;
    if (data) {
        user_id = data._id;
    } else {
        return res.json({ authorized: false });
    }

    async function addToDatabase(req, _id) {
        try {
            const user = await UserModel.findById(_id);
            user.calendar.push(...req.body.events);
            await user.save();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async function addToOutlook(req, _id) {
        try {
            const user = await graphHelper.getUserAsync(_id);
            const email = user.mail;
            const name = user.displayName;
            req.body.events.forEach(async (event) => {
                await graphHelper.addOutlookEvent(_id, email, name, event);
            })
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const db = addToDatabase(req, user_id);
    const outlook = addToOutlook(req, user_id);
    if (!db || !outlook) {
        return res
            .status(400)
            .json({ error: "Error saving to database or outlook" });
    }

    return res.json({ success: true });
}