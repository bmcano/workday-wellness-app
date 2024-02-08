import settings from '../outlookSettings.js';
import * as graphHelper from '../graphHelper.js';

/**
 * Job: Backend API for any calls related to the Microsoft Graph API.
 */

export const checkIfOutlookClientExist = (req, res) => {
    const result = graphHelper.checkIfClientExist();
    return res.json({ authorized: result });
}

export const initalizeOutlookClient = async (req, res) => {
    try {
        graphHelper.initializeGraphForUserAuth(settings, (deviceCodeMessage) => {
            console.log(deviceCodeMessage);
            return res.json({ authorized: true, deviceCodeMessage: deviceCodeMessage });
        });
        // we need to call this in order to be able to return the device code message for the user to authenticate
        await graphHelper.getUserAsync();
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: "Error connecting to Outlook."});
    }
}

export const getOutlookCalendar = async (req, res) => {
    try {
        const user = await graphHelper.getUserAsync();
        const email = user.mail;
        const calendar = await graphHelper.getCalendarAysnc(email);
        return res.json({ authorized: true, calendar: calendar });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: "Error connecting to Outlook."});
    }
}
