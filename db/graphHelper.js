import { DeviceCodeCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import authProviders from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js';

// File originated from Microsoft Corporation, but has since been modified for our need.

const userClients = {};

export function checkIfClientExist(user_id) {
    return !!userClients[user_id];
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

    const scheduleInformation = {
        schedules: [email],
        startTime: {
            dateTime: '2024-02-06T09:00:00',
            timeZone: 'Pacific Standard Time'
        },
        endTime: {
            dateTime: '2024-02-06T18:00:00',
            timeZone: 'Pacific Standard Time'
        },
        availabilityViewInterval: 60
    };

    return userClient.api('/me/calendar/getSchedule')
        .post(scheduleInformation);
}
