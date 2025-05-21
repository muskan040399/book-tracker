import { render, screen } from '@testing-library/react';
import App from './App';

test('renders My Book Tracker title', () => {
  render(<App />);
  const linkElement = screen.getByText(/My Book Tracker/i);
  expect(linkElement).toBeInTheDocument();
});
