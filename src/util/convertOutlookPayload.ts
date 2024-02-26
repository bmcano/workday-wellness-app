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

export const getFreeTimeSlots = (payload: EventInput[], workStartHour: number = 14, workEndHour: number = 23): { start: string, end: string }[] => {
    const events: EventInput[] = [...payload];
    events.sort((a, b) => new Date(a.start as string).getTime() - new Date(b.start as string).getTime());

    const freeTimeSlots: { start: string, end: string }[] = [];

    const workdayStart = new Date(events[0].start as string);
    workdayStart.setUTCHours(workStartHour, 0, 0, 0);

    const workdayEnd = new Date(events[0].start as string);
    workdayEnd.setUTCHours(workEndHour, 0, 0, 0);

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

    if (new Date(events[events.length - 1].end).getTime() < workdayEnd.getTime()) {
        freeTimeSlots.push({
            start: events[events.length - 1].end,
            end: workdayEnd.toISOString()
        });
    }

    // Filter out free time slots that are less than 15 minutes
    return freeTimeSlots.filter(slot => new Date(slot.end).getTime() - new Date(slot.start).getTime() >= 15 * 60 * 1000);
}