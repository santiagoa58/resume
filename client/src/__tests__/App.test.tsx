import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import useLoadResumeMetadataList from '../hooks/useLoadResumeMetadataList';
import { useGetSelectedResume, useSelectedResume } from '../hooks/useResume';
import { mockResume } from '../test_utils/apiMocks';

// Mock the hooks
jest.mock('../hooks/useLoadResumeMetadataList');
jest.mock('../hooks/useResume');

test('renders learn react link', () => {
  // mock finish loading
  (useLoadResumeMetadataList as jest.Mock).mockReturnValue(false);
  // mock getting resume response back
  (useGetSelectedResume as jest.Mock).mockReturnValue(mockResume);
  (useSelectedResume as jest.Mock).mockReturnValue(mockResume);
  render(<App />);

  // summary is visible
  expect(screen.getByText(mockResume.summary)).toBeInTheDocument();
  // education is visible
  mockResume.educations.forEach((education) => {
    expect(screen.getByText(education.degree)).toBeInTheDocument();
    expect(screen.getByText(education.institution)).toBeInTheDocument();
    expect(screen.getByText(education.duration)).toBeInTheDocument();
  });
  // experiences are visible
  mockResume.experiences.forEach((experience) => {
    expect(screen.getByText(experience.company)).toBeInTheDocument();
    expect(screen.getByText(experience.duration)).toBeInTheDocument();
    expect(screen.getByText(experience.role)).toBeInTheDocument();
  });
});
