import { getTimeUntilNextEvent } from '../util/convertOutlookPayload.ts';
jest.useFakeTimers('modern');

jest.setSystemTime(new Date('2024-03-28T21:30:00.000Z').getTime()); // set current time to 3:30pm CST
describe('getTimeUntilNextEvent', () => {
    test('returns time until next event', () => {
      const input = [
          {
            "title": "Meeting 1",
            "start": "2024-03-28T16:00:00.000Z", // 4pm UTC
            "end": "2024-03-28T16:30:00.000Z" // 4:30pm UTC
          },
          {
            "title": "Meeting 2",
            "start": "2024-03-28T17:00:00.000Z", // 5pm UTC
            "end": "2024-03-28T18:00:00.000Z" // 6pm UTC
          },
          {
            "title": "Meeting 3",
            "start": "2024-03-28T22:30:00.000Z", // 4:30pm CST
            "end": "2024-03-28T23:00:00.000Z" // 5pm CST
          }
        ];
      const expectedResult = 60; // 60 minutes until 4:30pm CST
      const result = getTimeUntilNextEvent(input);
      expect(result).toEqual(expectedResult);
    });

  test('returns 0 when there are no future events', () => {
    const input = [
      {
        "title": "Meeting 1",
        "start": "2024-03-28T14:00:00.000Z", // 8am
        "end": "2024-03-28T14:30:00.000Z" // 8:30am
      },
      {
        "title": "Meeting 2",
        "start": "2024-03-28T14:30:00.000Z", // 8:30am
        "end": "2024-03-28T15:00:00.000Z" // 9am
      }
    ];
    const expectedResult = 0; // no future events
    const result = getTimeUntilNextEvent(input);
    expect(result).toEqual(expectedResult);
  });

  test('returns null when there are no events', () => {
    const input = [];
    const expectedResult = null; // no events
    const result = getTimeUntilNextEvent(input);
    expect(result).toEqual(expectedResult);
  });
});

jest.useRealTimers();