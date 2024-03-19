import { getFreeTimeSlots } from '../util/convertOutlookPayload.ts';

describe('getFreeTimeSlots', () => {
  test('few meetings throughout the day, with default work hours', () => {
    const input = [
      {
        "title": "Meeting 1",
        "start": "2024-02-26T14:00:00.000Z", // 8am
        "end": "2024-02-26T14:15:00.000Z" // 8:15am
      },
      {
        "title": "Meeting 2",
        "start": "2024-02-26T17:00:00.000Z", // 11am
        "end": "2024-02-26T18:00:00.000Z" // 12pm
      },
      {
        "title": "Meeting 3",
        "start": "2024-02-26T20:30:00.000Z", // 2:30pm
        "end": "2024-02-26T21:00:00.000Z" // 3pm
      }
    ];
    const expectedResult = [
      {
        "start": "2024-02-26T14:15:00.000Z", // 8:15am
        "end": "2024-02-26T17:00:00.000Z" // 11am
      },
      {
        "start": "2024-02-26T18:00:00.000Z", // 12pm
        "end": "2024-02-26T20:30:00.000Z" // 2:30pm
      },
      {
        "start": "2024-02-26T21:00:00.000Z", // 3pm
        "end": "2024-02-26T23:00:00.000Z" // 5pm
      }
    ];
    // start: 8am, end: 5pm
    const result = getFreeTimeSlots(input);
    expect(result).toEqual(expectedResult);
  });

  // TODO: fix this scenario
  // test('no meetings are found during the day', () => {
  //   const input = [];
  //   const expectedResult = [
  //     {
  //       "start": "2024-02-26T14:00:00.000Z",
  //       "end": "2024-02-26T23:00:00.000Z"
  //     }
  //   ];
  //   // start: 8am, end: 5pm
  //   const result = getFreeTimeSlots(input);
  //   expect(result).toEqual(expectedResult);
  // });

  test('there is a full work day of meetings(s)', () => {
    const input = [
      {
        "start": "2024-02-26T14:00:00.000Z",
        "end": "2024-02-26T23:00:00.000Z"
      }
    ];
    const expectedResult = [];
    // start: 8am, end: 5pm
    const result = getFreeTimeSlots(input);
    expect(result).toEqual(expectedResult);
  });

  test('Contains a meeting that starts prior to the set work hours', () => {
    const input = [
      {
        start: "2024-02-26T13:00:00.000Z" //7am
        , end: "2024-02-26T14:15:00.000Z" //8:15am
      }
    ];
    const expectedResult = [
      {
        start: "2024-02-26T14:15:00.000Z", // 8:15am
        end: "2024-02-26T23:00:00.000Z" // 5pm
      }
    ];
    // start: 8am, end: 5pm
    const result = getFreeTimeSlots(input);
    expect(result).toEqual(expectedResult);
  });

  test('Contains a meeting that end after the set work hours', () => {
    const input = [
      {
        "start": "2024-02-26T22:00:00.000Z", // 4pm
        "end": "2024-02-26T26:00:00.000Z" // 6pm
      }
    ];
    const expectedResult = [
      {
        start: "2024-02-26T14:00:00.000Z", // 8:00am
        end: "2024-02-26T22:00:00.000Z" // 4pm
      }
    ];
    // start: 8am, end: 5pm
    const result = getFreeTimeSlots(input);
    expect(result).toEqual(expectedResult);
  });

  test('few meetings throughout the day, with custom work hours', () => {
    const input = [
      {
        "title": "Meeting 1",
        "start": "2024-02-26T14:00:00.000Z", // 8am
        "end": "2024-02-26T14:15:00.000Z" // 8:15am
      },
      {
        "title": "Meeting 2",
        "start": "2024-02-26T17:00:00.000Z", // 11am
        "end": "2024-02-26T18:00:00.000Z" // 12pm
      },
      {
        "title": "Meeting 3",
        "start": "2024-02-26T20:30:00.000Z", // 2:30pm
        "end": "2024-02-26T21:00:00.000Z" // 3pm
      }
    ];
    const expectedResult = [
      {
        "start": "2024-02-26T12:00:00.000Z", // 6am
        "end": "2024-02-26T14:00:00.000Z" // 8am
      },
      {
        "start": "2024-02-26T14:15:00.000Z", // 8:15am
        "end": "2024-02-26T17:00:00.000Z" // 11am
      },
      {
        "start": "2024-02-26T18:00:00.000Z", // 12pm
        "end": "2024-02-26T20:30:00.000Z" // 2:30pm
      }
    ];
    // start: 6am, end: 3pm
    const result = getFreeTimeSlots(input, 12, 20);
    expect(result).toEqual(expectedResult);
  });
});
