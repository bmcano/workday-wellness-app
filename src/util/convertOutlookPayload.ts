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
export const getFreeTimeSlots = (payload, workStartHour = 8, workEndHour = 17) => {
    const events = payload.map(item => {
        const startDate = new Date(item.start);
        const endDate = new Date(item.end);
        return {
            title: item.title,
            start: startDate.toISOString(),
            end: endDate.toISOString()
        };
    });

    events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    const freeTimeSlots = [];

    for (let i = 0; i < events.length - 1; i++) {
        freeTimeSlots.push({
            start: events[i].end,
            end: events[i + 1].start
        });
    }

    const workdayEnd = new Date(events[0].start);
    workdayEnd.setUTCHours(workEndHour, 0, 0, 0);

    if (new Date(events[events.length - 1].end).getTime() < workdayEnd.getTime()) {
        freeTimeSlots.push({
            start: events[events.length - 1].end,
            end: workdayEnd.toISOString()
        });
    }

    return freeTimeSlots;
}