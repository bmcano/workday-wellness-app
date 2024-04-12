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

export const getFreeTimeSlots = (payload: EventInput[], workStartTime: string = "08:00", workEndTime: string = "17:00"): { start: string, end: string }[] => {
    const events: EventInput[] = [...payload];
    // we do not want the end time coming before the start time
    const [hours1, minutes1] = workStartTime.split(':').map(Number);
    const [hours2, minutes2] = workEndTime.split(':').map(Number);
    if ((hours1 > hours2) || (hours1 === hours2 && minutes1 > minutes2) || (workStartTime === workEndTime)) {
        workStartTime = "08:00"
        workEndTime = "17:00"
    }
    // incase of empty string inputs
    workStartTime = workStartTime === "" ? "08:00" : workStartTime;
    workEndTime = workEndTime === "" ? "17:00" : workEndTime;

    const startHour = workStartTime.slice(0, 2) as unknown as number;
    const startMinute = workStartTime.slice(3) as unknown as number;
    const endHour = workEndTime.slice(0, 2) as unknown as number;
    const endMinute = workEndTime.slice(3) as unknown as number;
    // if there is no events for today just get start and end time
    // TODO: this returns the current day of events rather than the selected day, this needs to be fixed.
    if (events.length === 0) {
        const workdayStart = new Date();
        workdayStart.setHours(startHour, startMinute, 0, 0);
        const workdayEnd = new Date();
        workdayEnd.setHours(endHour, endMinute, 0, 0);
        return [{ start: workdayStart.toISOString(), end: workdayEnd.toISOString() }];
    }

    events.sort((a, b) => new Date(a.start as string).getTime() - new Date(b.start as string).getTime());

    const freeTimeSlots: { start: string, end: string }[] = [];

    const workdayStart = new Date(events[0].start as string);
    workdayStart.setHours(startHour, startMinute, 0, 0);

    const workdayEnd = new Date(events[0].start as string);
    workdayEnd.setHours(endHour, endMinute, 0, 0);

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
    if (events === null) return 0;

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