// tests SkillsTerminal component
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SkillsTerminal from '../SkillsTerminal';
import { mockResume } from '../../test_utils/apiMocks';
import TestProviders from '../../test_utils/testProvidersSetup';

describe('SkillsTerminal', () => {
  const mockSkills = mockResume.skills;
  it('renders SkillsTerminal component', () => {
    render(
      <TestProviders>
        <SkillsTerminal skills={mockSkills} />
      </TestProviders>
    );
    // renders the command input
    expect(screen.getByPlaceholderText('Enter command')).toBeInTheDocument();
    // welcome message is rendered
    expect(
      screen.getByText(/Welcome to the Skills Terminal!/i)
    ).toBeInTheDocument();
  });
  it('renders skills when list skills command is entered', () => {
    render(
      <TestProviders>
        <SkillsTerminal skills={mockSkills} />
      </TestProviders>
    );
    const input = screen.getByPlaceholderText('Enter command');
    fireEvent.change(input, { target: { value: 'list skills' } });
    fireEvent.submit(input);
    // all skills are rendered
    mockSkills.forEach((skill) => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });
  });
  it('renders help command output when help command is entered', () => {
    render(
      <TestProviders>
        <SkillsTerminal skills={mockSkills} />
      </TestProviders>
    );
    const input = screen.getByPlaceholderText('Enter command');
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.submit(input);
    // all help commands are rendered (use text matchers since the command output is a template literal)
    expect(
      // mentioned in welcome message and in help command output
      screen.getAllByText(/list skills/i, { selector: 'span' })[1]
    ).toBeInTheDocument();
    expect(
      screen.getByText(/clear/i, { selector: 'span' })
    ).toBeInTheDocument();
    expect(
      // mentioned in welcome message and in help command output
      screen.getAllByText(/help/i, { selector: 'span' })[1]
    ).toBeInTheDocument();
  });
  it('renders command not recognized output when command is not recognized', () => {
    render(
      <TestProviders>
        <SkillsTerminal skills={mockSkills} />
      </TestProviders>
    );
    const input = screen.getByPlaceholderText('Enter command');
    fireEvent.change(input, { target: { value: 'not a command' } });
    fireEvent.submit(input);
    expect(
      screen.getByText(/Command not recognized/, {
        normalizer: (text) => text.trim().split('.')[0],
      })
    ).toBeInTheDocument();
  });
});
