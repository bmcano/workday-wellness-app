import { EventInput } from '@fullcalendar/core'
import { convertUTCtoLocaleTimeZone } from './dateUtils.ts';

//convert the outlook payload to an array of EventInput
export const convertOutlookPayload = (payload: any): EventInput[] => {
    const { scheduleItems } = payload;

    const events: EventInput[] = scheduleItems.map(item => {
        const startDateUTC = new Date(item.start.dateTime);
        const endDateUTC = new Date(item.end.dateTime);
        const startDateCST = convertUTCtoLocaleTimeZone(startDateUTC);
        const endDateCST = convertUTCtoLocaleTimeZone(endDateUTC);
        return {
            title: item.subject,
            start: startDateCST,
            end: endDateCST
        };
    });

    return events;
}

export const getFreeTimeSlots = (payload: EventInput[], workStartHour: number = 8, workEndHour: number = 17): { start: string, end: string }[] => {
    const events: EventInput[] = [...payload];
    console.log(events)
    //no events, return the entire workday as free time
    if (events.length === 0) {
        const workdayStart = new Date();
        workdayStart.setHours(workStartHour, 0, 0, 0);
        const workdayEnd = new Date();
        workdayEnd.setHours(workEndHour, 0, 0, 0);
        return [{ start: workdayStart.toISOString(), end: workdayEnd.toISOString() }];
    }

    events.sort((a, b) => new Date(a.start as string).getTime() - new Date(b.start as string).getTime());

    const freeTimeSlots: { start: string, end: string }[] = [];

    const workdayStart = new Date(events[0].start as string);
    workdayStart.setHours(workStartHour, 0, 0, 0);

    const workdayEnd = new Date(events[0].start as string);
    workdayEnd.setHours(workEndHour, 0, 0, 0);

    if (events[0].start && new Date(events[0].start as string).getTime() > workdayStart.getTime()) {
        freeTimeSlots.push({
            start: workdayStart.toISOString(),
            end: events[0].start as string
        });
    }

    for (let i = 0; i < events.length - 1; i++) {
        if (new Date(events[i].end as string).getTime() < new Date(events[i + 1].start as string).getTime()) {
            freeTimeSlots.push({
                start: events[i].end as string,
                end: events[i + 1].start as string
            });
        }
    }
    const eventTime = events[events.length - 1].end as Date;
    if (new Date(eventTime).getTime() < workdayEnd.getTime()) {
        freeTimeSlots.push({
            start: eventTime.toString(),
            end: workdayEnd.toISOString()
        });
    }

    // Filter out free time slots that are less than 15 minutes
    return freeTimeSlots.filter(slot => new Date(slot.end).getTime() - new Date(slot.start).getTime() >= 15 * 60 * 1000);
}

//Function to get the time until the next event for the timer
export const getTimeUntilNextEvent = (payload: EventInput[]): number | null => {
    console.log('getTimeUntilNextEvent called');
    const events: EventInput[] = [...payload];
    if(events === null) return 0;

    // If there are no events, return null
    if (events.length === 0) {
        return null;
    }

    // Sort the events by start time
    events.sort((a, b) => new Date(a.start as string).getTime() - new Date(b.start as string).getTime());

    // Get the current time in UTC
    const nowInUTC = Date.now(); 
    console.log('nowInUTC:', nowInUTC);

    console.log('sorted events:', events);

    // Find the next event that hasn't started yet
    const nextEvent = events.find(event => {
        const eventStartTime = new Date(event.start as string).getTime();
        return eventStartTime > nowInUTC;
    });
    console.log('time until nextEvent:', nextEvent);

    // If there is no next event, return 0
    if (!nextEvent) {
        return 0;
    }

    // Calculate the time until the next event in minutes and round to the nearest whole number
    const timeUntilNextEvent = Math.round((new Date(nextEvent.start as string).getTime() - nowInUTC) / (1000 * 60));

    return timeUntilNextEvent;
}