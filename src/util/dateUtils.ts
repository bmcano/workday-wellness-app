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