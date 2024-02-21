import { format } from 'date-fns';

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