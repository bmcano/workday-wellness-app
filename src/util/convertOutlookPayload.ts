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
// that the workday is from 8am to 5pm. The workday start and end times can be customized
export const getFreeTimeSlots = (payload: any, workStartHour: number = 8, workEndHour: number = 17): { start: string, end: string }[] => {
    const { scheduleItems } = payload;

    // Get the current date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Filter the schedule items by the current day and convert them to an array of events with start and end times
    const events: EventInput[] = scheduleItems
        .filter(item => {
            const startDate = new Date(item.start);
            return startDate.getDate() === currentDate.getDate() &&
                startDate.getMonth() === currentDate.getMonth() &&
                startDate.getFullYear() === currentDate.getFullYear();
        })
        .map(item => {
            const startDateUTC = new Date(item.start);
            const endDateUTC = new Date(item.end);
            const startDateCST = new Date(startDateUTC.getTime() - (6 * 60 * 60 * 1000)).toISOString();
            const endDateCST = new Date(endDateUTC.getTime() - (6 * 60 * 60 * 1000)).toISOString();
            return {
                title: item.title,
                start: startDateCST,
                end: endDateCST
            } as EventInput;
        });

    // Sort the events by start time
    events.sort((a, b) => new Date(a.start as string).getTime() - new Date(b.start as string).getTime());

    // Initialize the free time slots array
    const freeTimeSlots: { start: string, end: string }[] = [];

    // Define the start and end of the workday
    const workdayStart = new Date(currentDate);
    workdayStart.setHours(workStartHour, 0, 0, 0);
    const workdayEnd = new Date(currentDate);
    workdayEnd.setHours(workEndHour, 0, 0, 0);

    // Check for a free time slot before the first event
    if (events.length === 0 || new Date(events[0].start as string).getTime() > workdayStart.getTime()) {
        freeTimeSlots.push({
            start: workdayStart.toISOString(),
            end: events.length > 0 ? events[0].start as string : workdayEnd.toISOString()
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
    if (events.length > 0 && new Date((events[events.length - 1].end as string)).getTime() < workdayEnd.getTime()) {
        freeTimeSlots.push({
            start: events[events.length - 1].end as string,
            end: workdayEnd.toISOString()
        });
    }

    return freeTimeSlots;
}