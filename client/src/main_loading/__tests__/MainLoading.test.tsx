import React from 'react';
import { render, screen } from '@testing-library/react';
import MainLoading from '../MainLoading';
import useLoadResumeMetadataList from '../../hooks/useLoadResumeMetadataList';

// Mock the useLoadResumeMetadataList hook
jest.mock('../../hooks/useLoadResumeMetadataList');

test('displays loading indicator while fetching data', () => {
  // Mock the hook's implementation
  (useLoadResumeMetadataList as jest.Mock).mockReturnValue(true);
  const { rerender } = render(<MainLoading />);
  // Check that the loading indicator is displayed
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  // Mock the hook's implementation again to simulate data being fetched
  (useLoadResumeMetadataList as jest.Mock).mockReturnValue(false);
  rerender(<MainLoading />);
  expect(
    screen.queryByLabelText('resume-list-progress')
  ).not.toBeInTheDocument();
});
