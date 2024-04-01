import moment from "moment";

interface TimeSlots {
    start: Date,
    end: Date
}

export const distributeEvents = (freeTimeSlots: TimeSlots[], eventNames: Array<string>) => {
    const totalAvailableTime = freeTimeSlots.reduce((acc, slot) => acc + (new Date(slot.end).getTime() - new Date(slot.start).getTime()), 0);
    let startTime = new Date(freeTimeSlots[0].start);
    const timeBetweenEvents = Math.floor(totalAvailableTime / eventNames.length); // time between events in ms
    const numEvents = eventNames.length;
    console.log(timeBetweenEvents / 1000 / 60)
    const result: TimeSlots[] = [];

    console.log(freeTimeSlots)
    for (let i = 0; i < numEvents; i++) {
        const eventName = eventNames[i];

        while (!isDateWithinFreeTimeSlots(startTime, freeTimeSlots)) {
            const newStartTime = new Date(startTime);
            newStartTime.setMinutes(newStartTime.getMinutes() + 1);
            startTime = newStartTime;
        }

        const end = new Date(startTime);
        end.setMinutes(end.getMinutes() + 5);
        const eventData = {
            title: eventName,
            start: startTime,
            end: end,
            isExercise: true,
        };
        result.push(eventData);
        const newStartTime = new Date(startTime);
        newStartTime.setMilliseconds(newStartTime.getMilliseconds() + timeBetweenEvents);
        startTime = newStartTime;
    }

    return result;
};

const isDateWithinFreeTimeSlots = (date: Date, freeTimeSlots: TimeSlots[]) => {
    const dateTime = new Date(date);
    const now = moment(dateTime);
    for (const slot of freeTimeSlots) {
        const startTime = new Date(slot.start);
        const endTime = new Date(slot.end);
        if (now.isAfter(startTime) && now.isBefore(endTime)) {
            return true;
        }
    }
    return false;
};