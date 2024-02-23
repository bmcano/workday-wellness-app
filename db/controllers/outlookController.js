import settings from '../graphApi/outlookSettings.js';
import * as graphHelper from '../graphApi/graphHelper.js';
import UserModel from '../models/Users.js';

/**
 * Job: Backend API for any calls related to the Microsoft Graph API.
 */

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
        return res
            .status(500)
            .json({ error: "Error connecting to Outlook." });
    }
}

export const getOutlookCalendar = async (req, res) => {
    try {
        const user = await graphHelper.getUserAsync(req.session._id);
        const email = user.mail;
        const calendar = await graphHelper.getCalendarAysnc(req.session._id, email);
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
