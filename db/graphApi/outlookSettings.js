// File originated from Microsoft Corporation, but has since been modified for our need.

import 'dotenv/config';

const settings = {
    'clientId': process.env.REACT_APP_AZURE_CLIENT_ID,
    'tenantId': 'common',
    'graphUserScopes': [
        'user.read',
        'mail.read',
        'mail.send',
        'calendars.read',
        'calendars.read.shared',
        'calendars.readbasic',
        'calendars.readwrite',
        'calendars.readwrite.shared',
    ]
};

export default settings;