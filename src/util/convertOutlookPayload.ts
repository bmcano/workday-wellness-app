import { EventInput } from '@fullcalendar/core'

export const convertOutlookPayload = (payload: any): EventInput[] => {
    const { scheduleItems } = payload;

    const events: EventInput[] = scheduleItems.map(item => ({
      title: item.subject,
      start: new Date(item.start.dateTime),
      end: new Date(item.end.dateTime),
    }));

    return events;
}