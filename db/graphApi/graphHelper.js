import { DeviceCodeCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import authProviders from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js';
import { recurringEvent, singleEvent } from './outlookEventOutline.js';

// File originated from Microsoft Corporation, but has since been modified for our need.

const userClients = {};

export function checkIfClientExist(user_id) {
    if (userClients[user_id] !== undefined) {
        if (userClients[user_id].httpClient.middleware.authenticationProvider.tokenCredential.msalFlow.account !== undefined) {
            console.log("User is logged into Outlook.");
            return true;
        }
    }
    return false;
}

export function initializeGraphForUserAuth(user_id, settings, deviceCodePrompt) {
    if (!settings) {
        throw new Error('Settings cannot be undefined');
    }

    const _deviceCodeCredential = new DeviceCodeCredential({
        clientId: settings.clientId,
        tenantId: settings.tenantId,
        userPromptCallback: deviceCodePrompt
    });

    const authProvider = new authProviders.TokenCredentialAuthenticationProvider(
        _deviceCodeCredential, {
        scopes: settings.graphUserScopes
    });

    userClients[user_id] = Client.initWithMiddleware({
        authProvider: authProvider
    });
}

export async function getUserAsync(user_id) {
    const userClient = userClients[user_id];
    if (!userClient) {
        throw new Error('Graph has not been initialized for user auth');
    }

    return userClient.api('/me')
        .select(['displayName', 'mail', 'userPrincipalName'])
        .get();
}

export async function getCalendarAysnc(user_id, email, body) {
    const userClient = userClients[user_id];
    if (!userClient) {
        throw new Error('Graph has not been initialized for user auth');
    }

    const scheduleInformation = {
        schedules: [email],
        startTime: {
            dateTime: body.start,
            timeZone: 'Central Standard Time'
        },
        endTime: {
            dateTime: body.end,
            timeZone: 'Central Standard Time'
        },
        availabilityViewInterval: 60
    };

    return userClient.api('/me/calendar/getSchedule')
        .post(scheduleInformation);
}

export async function addOutlookEvent(user_id, email, name, eventData) {
    const userClient = userClients[user_id];
    if (!userClient) {
        throw new Error('Graph has not been initialized for user auth');
    }

    let event = {}
    if (!eventData.recurrence || eventData.recurrence === "") {
        event = singleEvent(eventData, email, name);
    } else {
        event = recurringEvent(eventData, email, name);
    }

    await userClient.api('/me/events')
        .post(event);
}
