import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders learn react link', () => {
  render(<App />);
  // get the progress bar with aria-label="resume-list-progress"
  const progressBar = screen.getByLabelText(/resume-list-progress/i);
  expect(progressBar).toBeInTheDocument();
});
