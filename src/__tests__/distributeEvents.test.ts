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
    // probably need to include a checker in the code to make sure there are free time slots available
    // it('should return an empty array when no free time slots are available', () => {
    //   const freeTimeSlots = [];
    //   const eventNames = ['Event 1', 'Event 2'];
    //   const distributedEvents = distributeEvents(freeTimeSlots, eventNames);
  
    //   expect(distributedEvents).toEqual([]);
    // });
    
    it('should handle a single free time slot correctly', () => {
        const freeTimeSlots = [
          { start: new Date('2024-03-25T09:00:00'), end: new Date('2024-03-25T10:00:00') },
        ];
        const eventNames = ['Event 1'];
        const distributedEvents = distributeEvents(freeTimeSlots, eventNames);
    
        expect(distributedEvents.length).toBe(1);
        expect(distributedEvents[0]["title"]).toBe('Event 1');
      });
    
      
  
  });