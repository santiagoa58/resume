import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Landing from '../Landing';
import { useGetSelectedResume, useSelectedResume } from '../../hooks/useResume';
import { mockResume } from '../../test_utils/apiMocks';
import TestProviders from '../../test_utils/testProvidersSetup';

jest.mock('../../hooks/useResume');

test('email button is not rendered when missing contacts', () => {
  const testResume = { ...mockResume, contacts: [], email: undefined };
  (useGetSelectedResume as jest.Mock).mockReturnValue({
    resume: testResume,
    loading: false,
    error: '',
  });
  (useSelectedResume as jest.Mock).mockReturnValue(testResume);

  render(
    <TestProviders>
      <Landing
        title={mockResume.name}
        actionButtonProps={{ onClick: jest.fn(), children: 'test button' }}
      />
    </TestProviders>
  );

  //expect the email me and learn more buttons to be visible:
  expect(screen.queryByText('Email Me')).not.toBeInTheDocument();
});

test('renders resume content correctly', async () => {
  // Mock the hook's implementations
  (useGetSelectedResume as jest.Mock).mockReturnValue({
    resume: mockResume,
    loading: false,
    error: '',
  });
  (useSelectedResume as jest.Mock).mockReturnValue(mockResume);
  const actionButtonOnClick = jest.fn();
  render(
    <TestProviders>
      <Landing
        title={mockResume.name}
        actionButtonProps={{
          onClick: actionButtonOnClick,
          children: 'test button',
        }}
      />
    </TestProviders>
  );

  //expect the email me and action buttons to be visible:
  expect(screen.getByText('Email Me')).toBeInTheDocument();
  expect(screen.getByText('test button')).toBeInTheDocument();
  // mui ripple effects (occur when clicking on buttons) need to be wrapped in act
  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => userEvent.click(screen.getByText('test button')));
  expect(actionButtonOnClick).toBeCalledTimes(1);

  // expect the rest of the contacts to be rendered as buttons
  expect(screen.getByLabelText('github')).toBeInTheDocument();
  expect(screen.getByLabelText('linkedin')).toBeInTheDocument();
  expect(screen.getByLabelText('instagram')).toBeInTheDocument();
  // only contacts specified in the response should have buttons rendered
  expect(screen.queryByLabelText('twitter')).not.toBeInTheDocument();

  // // Check that the resume name is displayed
  expect(screen.getByText(`<${mockResume.name}/>`)).toBeInTheDocument();
});
