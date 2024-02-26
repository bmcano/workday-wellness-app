import { render, screen } from '@testing-library/react';
import App from '../App';
import { getFreeTimeSlots } from '../util/convertOutlookPayload.ts';

test('test when a user is free', () => {
  // render(<App />);
  // const linkElement = screen.getByText(/Home/i);
  // expect(linkElement).toBeInTheDocument();
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
  const result = getFreeTimeSlots(input);
  expect(result).toEqual(expectedResult);
});
