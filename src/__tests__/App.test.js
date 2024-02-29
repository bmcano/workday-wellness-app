import { render, screen } from '@testing-library/react';
import App from '../App';
import { getFreeTimeSlots } from '../util/convertOutlookPayload.ts';

test('test when a user is free', () => {
  // render(<App />);
  // const linkElement = screen.getByText(/Home/i);
  // expect(linkElement).toBeInTheDocument();

  //basic test case with a few meetings in the day 
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
  // start: 8am, end: 5pm
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

  //test when a user has no events
  //note: this case's date needs to be updated depending on the current date
  const input2 = [];
  const expectedResult2 = [
    {
      start: "2024-02-29T14:00:00.000Z", // 8am
      end: "2024-02-29T23:00:00.000Z" // 5pm
    }
  ];

  //only one morning meeting that starts before the official workday
  const input3 = [
    {start: "2024-02-26T13:00:00.000Z" //7am
  , end: "2024-02-26T14:15:00.000Z" //8:15am
  }
  ];
  const expectedResult3 = [
    {
      start: "2024-02-26T14:15:00.000Z", // 8:15am
      end: "2024-02-26T23:00:00.000Z" // 5pm
    }
  ];

  //only one afternoon meeting that ends after the official workday
  const input4 = [
    {
      "start": "2024-02-26T22:00:00.000Z", // 4pm
      "end": "2024-02-26T26:00:00.000Z" // 6pm
    }
  ];
  const expectedResult4 = [
    {
      start: "2024-02-26T14:00:00.000Z", // 8:00am
      end: "2024-02-26T22:00:00.000Z" // 4pm
    }
  ];

  //meeting that lasts all day
  const input5 = [
    {
      start: "2024-02-26T14:00:00.000Z", // 8:00am
      end: "2024-02-26T23:00:00.000Z" // 5pm
    }
  ];
  const expectedResult5 = [];

  
  const result = getFreeTimeSlots(input);
  expect(result).toEqual(expectedResult);

  const result2 = getFreeTimeSlots(input2);
  expect(result2).toEqual(expectedResult2);

  const result3 = getFreeTimeSlots(input3);
  expect(result3).toEqual(expectedResult3);

  const result4 = getFreeTimeSlots(input4);
  expect(result4).toEqual(expectedResult4);

  const result5 = getFreeTimeSlots(input5);
  expect(result5).toEqual(expectedResult5);
});
