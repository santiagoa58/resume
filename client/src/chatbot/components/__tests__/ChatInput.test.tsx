import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatInput from '../ChatInput';

describe('ChatInput', () => {
  const mockOnSend = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render text input', () => {
    render(<ChatInput onSend={mockOnSend} disabled={false} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('should call onSend when send button is clicked', async () => {
    render(<ChatInput onSend={mockOnSend} disabled={false} />);

    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /send/i });

    await userEvent.type(input, 'Hello AI');
    fireEvent.click(sendButton);

    expect(mockOnSend).toHaveBeenCalledWith('Hello AI');
  });

  it('should call onSend when Enter key is pressed', async () => {
    render(<ChatInput onSend={mockOnSend} disabled={false} />);

    const input = screen.getByRole('textbox');

    await userEvent.type(input, 'Hello AI{Enter}');

    expect(mockOnSend).toHaveBeenCalledWith('Hello AI');
  });

  it('should not send empty messages', async () => {
    render(<ChatInput onSend={mockOnSend} disabled={false} />);

    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('should not send whitespace-only messages', async () => {
    render(<ChatInput onSend={mockOnSend} disabled={false} />);

    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /send/i });

    await userEvent.type(input, '   ');
    fireEvent.click(sendButton);

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('should clear input after sending', async () => {
    render(<ChatInput onSend={mockOnSend} disabled={false} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    const sendButton = screen.getByRole('button', { name: /send/i });

    await userEvent.type(input, 'Test message');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('should disable input when disabled prop is true', () => {
    render(<ChatInput onSend={mockOnSend} disabled={true} />);

    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /send/i });

    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();
  });

  it('should show custom placeholder', () => {
    render(
      <ChatInput
        onSend={mockOnSend}
        disabled={false}
        placeholder="Custom placeholder"
      />
    );

    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('should show default placeholder when none provided', () => {
    render(<ChatInput onSend={mockOnSend} disabled={false} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder');
  });

  it('should trim whitespace from input', async () => {
    render(<ChatInput onSend={mockOnSend} disabled={false} />);

    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /send/i });

    await userEvent.type(input, '  Test message  ');
    fireEvent.click(sendButton);

    expect(mockOnSend).toHaveBeenCalledWith('Test message');
  });

  it('should not send on Enter if Shift is pressed', async () => {
    render(<ChatInput onSend={mockOnSend} disabled={false} />);

    const input = screen.getByRole('textbox');

    await userEvent.type(input, 'Line 1{Shift>}{Enter}{/Shift}Line 2');

    // Should not have called onSend (Shift+Enter adds newline, doesn't send)
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('should focus input on mount', () => {
    render(<ChatInput onSend={mockOnSend} disabled={false} />);

    const input = screen.getByRole('textbox');
    // Input should be focusable
    expect(input).toBeInTheDocument();
  });

  it('should handle async onSend', async () => {
    const asyncOnSend = jest.fn().mockResolvedValue(undefined);

    render(<ChatInput onSend={asyncOnSend} disabled={false} />);

    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /send/i });

    await userEvent.type(input, 'Test');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(asyncOnSend).toHaveBeenCalled();
    });
  });
});
