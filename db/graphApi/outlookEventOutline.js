export const singleEvent = (eventData, email, name) => {
    return {
        subject: eventData.title,
        body: {
            contentType: 'HTML',
            content: 'Sent from Workday Wellness' // TODO - add exercise information as well
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
}

export const recurringEvent = (eventData, email, name) => {
    let daysOfWeek = [];
    if (eventData.recurrence === "daily") {
        daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    } else {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        daysOfWeek = [ days[dayOfWeek] ];
    }

    return {
        subject: eventData.title,
        body: {
            contentType: 'HTML',
            content: 'Sent from Workday Wellness' // TODO - add exercise information as well
        },
        start: {
            dateTime: eventData.start,
            timeZone: 'Central Standard Time'
        },
        end: {
            dateTime: eventData.start,
            timeZone: 'Central Standard Time'
        },
        recurrence: {
            pattern: {
                type: eventData.recurrence,
                interval: 1,
                daysOfWeek: daysOfWeek
            },
            range: {
                type: 'endDate',
                startDate: eventData.start.substring(0, 10),
                endDate: eventData.end.substring(0, 10)
            }
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
}