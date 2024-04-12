export const getWorkHours = (day: number, schedule: any): { start: string, end: string } => {
    switch (day) {
        case 1:
            return schedule.Monday;
        case 2:
            return schedule.Tuesday;
        case 3:
            return schedule.Wednesday;
        case 4:
            return schedule.Thursday;
        case 5:
            return schedule.Friday;
        default:
            // for weekends we currently aren't tracking work hours, so just default 8a-5p
            return { start: '08:00', end: '17:00' }
    }
}