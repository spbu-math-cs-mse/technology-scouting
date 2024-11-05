<<<<<<< HEAD
test("dummy id test", () => {
  "a" === "a"
=======
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
>>>>>>> 16852d4 (style: apply frontend formatter)
});
