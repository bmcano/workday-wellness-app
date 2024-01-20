import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders home page', () => {
  render(<App />);
  const linkElement = screen.getByText(/Home/i);
  expect(linkElement).toBeInTheDocument();
});