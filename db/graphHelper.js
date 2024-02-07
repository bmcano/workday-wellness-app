import { DeviceCodeCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import authProviders from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js';


let _settings = undefined;
let _deviceCodeCredential = undefined;
let _userClient = undefined;

export function checkIfClientExist() {
    if (_userClient) {
        return true
    }
    return false
}

export function initializeGraphForUserAuth(settings, deviceCodePrompt) {
    if (!settings) {
        throw new Error('Settings cannot be undefined');
    }

    _settings = settings;

    console.log(settings);

    _deviceCodeCredential = new DeviceCodeCredential({
        clientId: settings.clientId,
        tenantId: settings.tenantId,
        userPromptCallback: deviceCodePrompt
    });

    const authProvider = new authProviders.TokenCredentialAuthenticationProvider(
        _deviceCodeCredential, {
        scopes: settings.graphUserScopes
    });

    _userClient = Client.initWithMiddleware({
        authProvider: authProvider
    });
}

export async function getUserAsync() {
    if (!_userClient) {
        throw new Error('Graph has not been initialized for user auth');
    }

    return _userClient.api('/me')
        // Only request specific properties
        .select(['displayName', 'mail', 'userPrincipalName'])
        .get();

}

export async function getCalendarAysnc(email) {
    if (!_userClient) {
        throw new Error('Graph has not been initialized for user auth');
    }

    console.log(email)
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

    return _userClient.api('/me/calendar/getSchedule')
        .post(scheduleInformation);
}