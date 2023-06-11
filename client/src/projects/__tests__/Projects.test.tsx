// test Projects.tsx component
import React from 'react';
import { render, screen } from '@testing-library/react';
import Projects from '../Projects';
import useProjects from '../../hooks/useProjects';
import { mockProject } from '../../test_utils/apiMocks';

// mock useProjects hook
jest.mock('../../hooks/useProjects');

describe('Projects', () => {
  it('renders Projects component', () => {
    (useProjects as jest.Mock).mockReturnValue({
      projects: [],
      loading: true,
      error: '',
    });
    render(<Projects />);
    expect(screen.getByText('<Projects/>')).toBeInTheDocument();
    expect(screen.getByLabelText('loading')).toBeInTheDocument();
  });
  it('renders error message if useProjects hook returns an error', () => {
    (useProjects as jest.Mock).mockReturnValue({
      projects: [],
      loading: false,
      error: 'Error loading projects',
    });
    render(<Projects />);
    expect(screen.getByText('Error loading projects')).toBeInTheDocument();
  });
  it('renders projects if projects are fetched', () => {
    // mock useProjects hook to return projects
    (useProjects as jest.Mock).mockReturnValue({
      projects: [mockProject],
      loading: false,
      error: '',
    });
    render(<Projects />);
    // project card is rendered
    expect(screen.getByText(mockProject.name)).toBeInTheDocument();
  });
});
