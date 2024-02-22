import { EventInput } from '@fullcalendar/core'

//convert the outlook payload to an array of EventInput
export const convertOutlookPayload = (payload: any): EventInput[] => {
    const { scheduleItems } = payload;

    const events: EventInput[] = scheduleItems.map(item => {
        const startDateUTC = new Date(item.start.dateTime);
        const endDateUTC = new Date(item.end.dateTime);
        const startDateCST = new Date(startDateUTC.getTime() - (6 * 60 * 60 * 1000)).toISOString();
        const endDateCST = new Date(endDateUTC.getTime() - (6 * 60 * 60 * 1000)).toISOString();
        return {
            title: item.subject,
            start: startDateCST,
            end: endDateCST
        };
    });

    return events;
}

//fetch the user email from the payload
export const getUserEmailFromPayload = (payload: any): string => {
    const { attendees } = payload;
    return attendees[0].emailAddress.address;
}