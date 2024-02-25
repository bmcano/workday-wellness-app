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

// This function returns an array of free time slots, where each slot is an object with start and 
// end properties indicating the start and end times of the free slot. The function assumes 
// that the workday is from 9am to 5pm.
export const getFreeTimeSlots = (payload: any): { start: string, end: string }[] => {
    const { scheduleItems } = payload;

    // Convert the schedule items to an array of events with start and end times
    const events: EventInput[] = scheduleItems.map(item => {
        const startDateUTC = new Date(item.start.dateTime);
        const endDateUTC = new Date(item.end.dateTime);
        const startDateCST = new Date(startDateUTC.getTime() - (6 * 60 * 60 * 1000)).toISOString();
        const endDateCST = new Date(endDateUTC.getTime() - (6 * 60 * 60 * 1000)).toISOString();
        return {
            title: item.subject,
            start: startDateCST,
            end: endDateCST
        } as EventInput;
    });

    // Sort the events by start time
    events.sort((a, b) => new Date(a.start as string).getTime() - new Date(b.start as string).getTime());

    // Initialize the free time slots array
    const freeTimeSlots: { start: string, end: string }[] = [];

    // Define the start and end of the workday
    const workdayStart = new Date(events[0].start as string);
    workdayStart.setHours(9, 0, 0, 0);
    const workdayEnd = new Date(events[0].start as string);
    workdayEnd.setHours(17, 0, 0, 0);

    // Check for a free time slot before the first event
    if (new Date(events[0].start as string).getTime() > workdayStart.getTime()) {
        freeTimeSlots.push({
            start: workdayStart.toISOString(),
            end: events[0].start as string
        });
    }

    // Check for free time slots between events
    for (let i = 0; i < events.length - 1; i++) {
        if (new Date((events[i].end as string)).getTime() < new Date((events[i + 1].start as string)).getTime()) {
            freeTimeSlots.push({
                start: events[i].end as string,
                end: events[i + 1].start as string
            });
        }
    }

    // Check for a free time slot after the last event
    if (new Date((events[events.length - 1].end as string)).getTime() < workdayEnd.getTime()) {
        freeTimeSlots.push({
            start: events[events.length - 1].end as string,
            end: workdayEnd.toISOString()
        });
    }

    return freeTimeSlots;
}

//fetch the user email from the payload
export const getUserEmailFromPayload = (payload: any): string => {
    const { attendees } = payload;
    return attendees[0].email;
}
