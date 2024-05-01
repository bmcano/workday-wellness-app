import { format } from 'date-fns';
import moment from 'moment-timezone';

/**
 * Job: functions that have to do with dates
 */
export const getCurrentFormattedDate = (): string => {
    const weekdays: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const suffix: string[] = ["th", "st", "nd", "rd"];

    const today = new Date();
    const dayOfWeek: string = weekdays[today.getDay()];
    const month: string = months[today.getMonth()];
    const dayOfMonth: number = today.getDate();

    const formattedDayOfMonth: string = dayOfMonth + (suffix[(dayOfMonth % 100 - 20) % 10] || suffix[dayOfMonth % 100] || suffix[0]);
    return `${dayOfWeek}, ${month} ${formattedDayOfMonth}, ${today.getFullYear()}`;
}

export const formatDateforDatabase = (date: Date): Date => {
    // Input: Tue Feb 20 2024 14:30:00 GMT-0600 (Central Standard Time)
    // Output: 2024-02-02T14:30:00.000Z
    return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS") as unknown as Date
}

export const isEventOccuringNow = (start: Date, end: Date): boolean => {
    const date = new Date();
    const now = moment(date);
    const startMoment = moment(start).tz("UTC");
    const endMoment = moment(end).tz("UTC");
    return now.isAfter(startMoment) && now.isBefore(endMoment);
}

export const convertToLocaleISOString = (date: Date): string => {
    const now = date.toLocaleDateString();
    const month = now.slice(0, 1).padStart(2, '0');
    const day = now.slice(2, 3).padStart(2, '0');
    const year = now.slice(4);
    return `${year}-${month}-${day}`;
}

export const getCurrentLocaleDateString = (): string => {
    // returns: YYYY-MM-DD in local timezone
    const now = new Date().toLocaleDateString();
    // NOTE: this changes depending on month and day number, javascript is not fun
    const month = now.slice(0, 1).padStart(2, '0');
    const day = now.slice(2, 3).padStart(2, '0');
    const year = now.slice(4);
    return `${year}-${month}-${day}`;
}

export const getCurrentLocaleDateTimeString = (): string => {
    // returns: YYYY-MM-DDTXX:XX:XX.000 in local timezone
    const now = new Date().toLocaleString('en-US', { hour12: false });
    // NOTE: this changes depending on month and day number, javascript is not fun
    const month = now.slice(0, 1).padStart(2, '0');
    const day = now.slice(2, 3).padStart(2, '0');
    const year = now.slice(4, 8);
    const time = now.slice(10).padStart(8, '0');
    return `${year}-${month}-${day}T${time}.000`;
}

export const convertUTCtoLocaleTimeZone = (date: Date): string => {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000)).toISOString();
}

export const convertUTCStringtoLocaleTimeZone = (date: string | undefined): string => {
    if (!date) return "";
    const now = new Date(date) 
    return new Date(now.getTime() - (now.getTimezoneOffset() * 60 * 1000)).toISOString();
}