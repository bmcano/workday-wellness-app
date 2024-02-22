import { DeviceCodeCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import authProviders from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js';

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

    console.log(settings);

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

export async function getCalendarAysnc(user_id, email) {
    const userClient = userClients[user_id];
    if (!userClient) {
        throw new Error('Graph has not been initialized for user auth');
    }

    const date = new Date();
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const scheduleInformation = {
        schedules: [email],
        startTime: {
            dateTime: startDate,
            timeZone: 'Central Standard Time'
        },
        endTime: {
            dateTime: endDate,
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
    const event = {
        subject: eventData.title,
        body: {
            contentType: 'HTML',
            content: 'Sent from Workday Wellness'
        },
        start: {
            dateTime: eventData.start,
            timeZone: 'Central Standard Time'
        },
        end: {
            dateTime: eventData.end,
            timeZone: 'Central Standard Time'
        },
        location: {
            displayName: ''
        },
        attendees: [
            {
                emailAddress: {
                    address: email,
                    name: name
                },
                type: 'required'
            }
        ],
        allowNewTimeProposals: false
    };

    await userClient.api('/me/events')
        .post(event);
}
