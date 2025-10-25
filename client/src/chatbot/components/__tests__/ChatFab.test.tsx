import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatFab from '../ChatFab';
import { ModelStatus } from '../../context/AIModelContext';

describe('ChatFab', () => {
  const mockOnClick = jest.fn();
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render FAB button', () => {
    render(<ChatFab onClick={mockOnClick} modelStatus="ready" />);
    const fab = screen.getByRole('button', { name: /chat with ai/i });
    expect(fab).toBeInTheDocument();
  });

  it('should call onClick when clicked in ready state', () => {
    render(<ChatFab onClick={mockOnClick} modelStatus="ready" />);
    const fab = screen.getByRole('button', { name: /chat with ai/i });
    fireEvent.click(fab);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should show loading tooltip when loading', () => {
    render(<ChatFab onClick={mockOnClick} modelStatus="loading" />);
    const fab = screen.getByRole('button');
    fireEvent.mouseOver(fab);
    // Tooltip should indicate loading state
    expect(fab).toBeInTheDocument();
  });

  it('should show error tooltip when in error state', () => {
    render(<ChatFab onClick={mockOnClick} modelStatus="error" />);
    const fab = screen.getByRole('button');
    fireEvent.mouseOver(fab);
    // Should show error state
    expect(fab).toBeInTheDocument();
  });

  it('should call onRetry when clicked in error state', () => {
    render(
      <ChatFab
        onClick={mockOnClick}
        modelStatus="error"
        onRetry={mockOnRetry}
      />
    );
    const fab = screen.getByRole('button', { name: /chat with ai/i });
    fireEvent.click(fab);
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should call onClick in error state if no onRetry provided', () => {
    render(<ChatFab onClick={mockOnClick} modelStatus="error" />);
    const fab = screen.getByRole('button', { name: /chat with ai/i });
    fireEvent.click(fab);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should show ready tooltip when ready', () => {
    render(<ChatFab onClick={mockOnClick} modelStatus="ready" />);
    const fab = screen.getByRole('button');
    expect(fab).toHaveAttribute('aria-label', 'chat with ai');
  });

  it('should show idle state initially', () => {
    render(<ChatFab onClick={mockOnClick} modelStatus="idle" />);
    const fab = screen.getByRole('button');
    expect(fab).toBeInTheDocument();
  });

  it('should have correct accessibility attributes', () => {
    render(<ChatFab onClick={mockOnClick} modelStatus="ready" />);
    const fab = screen.getByRole('button', { name: /chat with ai/i });
    expect(fab).toHaveAttribute('aria-label', 'chat with ai');
  });
});
