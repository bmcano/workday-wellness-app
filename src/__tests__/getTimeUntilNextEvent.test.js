import { getTimeUntilNextEvent } from '../util/convertOutlookPayload.ts';
jest.useFakeTimers('modern');

jest.setSystemTime(new Date('2024-03-27T19:30:00.000Z').getTime()); // set current time to 1:30pm UTC

describe('getTimeUntilNextEvent', () => {
  test('returns time until next event', () => {
    const input = [
        {
          "title": "Meeting 1",
          "start": "2024-03-27T16:00:00.000Z", // 4pm UTC
          "end": "2024-03-27T16:30:00.000Z" // 4:30pm UTC
        },
        {
          "title": "Meeting 2",
          "start": "2024-03-27T17:00:00.000Z", // 5pm UTC
          "end": "2024-03-27T18:00:00.000Z" // 6pm UTC
        },
        {
          "title": "Meeting 3",
          "start": "2024-03-27T20:30:00.000Z", // 8:30pm UTC
          "end": "2024-03-27T21:00:00.000Z" // 9pm UTC
        }
      ];
    const expectedResult = 60; // 60 minutes until 2:30pm
    const result = getTimeUntilNextEvent(input);
    expect(result).toEqual(expectedResult);
  });

  test('returns 0 when there are no future events', () => {
    const input = [
      {
        "title": "Meeting 1",
        "start": "2024-03-27T14:00:00.000Z", // 8am
        "end": "2024-03-27T14:30:00.000Z" // 8:30am
      },
      {
        "title": "Meeting 2",
        "start": "2024-03-27T14:30:00.000Z", // 8:30am
        "end": "2024-03-27T15:00:00.000Z" // 9am
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