import { distributeEvents } from "../util/distributeEvents";
describe('distributeEvents', () => {
    it('should evenly distribute events within free time slots', () => {
      const freeTimeSlots = [
        { start: new Date('2024-03-25T09:00:00'), end: new Date('2024-03-25T11:00:00') },
        { start: new Date('2024-03-25T13:00:00'), end: new Date('2024-03-25T15:00:00') },
      ];
      const eventNames = ['Event 1', 'Event 2', 'Event 3', 'Event 4'];
      const distributedEvents = distributeEvents(freeTimeSlots, eventNames);
  
      expect(distributedEvents.length).toBe(eventNames.length);
      distributedEvents.forEach((event, index) => {
        if (index > 0) {
          expect(event.start.getTime()).toBeGreaterThanOrEqual(distributedEvents[index - 1].end.getTime());
        }
      });
    });
    
    it('should handle a single free time slot correctly', () => {
      const freeTimeSlots = [
        { start: new Date('2024-03-25T09:00:00'), end: new Date('2024-03-25T10:00:00') },
      ];
      const eventNames = ['Event 1'];
      const distributedEvents = distributeEvents(freeTimeSlots, eventNames);
  
      expect(distributedEvents.length).toBe(1);
      expect(distributedEvents[0]["title"]).toBe('Event 1');
    });

    it('create a new start and end time properly', () => {
      const freeTimeSlots = [
        { start: new Date('2024-03-25T09:00:00'), end: new Date('2024-03-25T10:00:00') },
      ];
      const eventNames = ['Event 1'];
      const distributedEvents = distributeEvents(freeTimeSlots, eventNames);
      expect(distributedEvents[0]["start"]).toEqual(new Date('2024-03-25T09:01:00'));
      expect(distributedEvents[0]["end"]).toEqual(new Date('2024-03-25T09:06:00'));
    });
  });