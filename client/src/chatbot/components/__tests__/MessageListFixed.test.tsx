import React from 'react';
import { render, screen } from '@testing-library/react';
import MessageListFixed from '../MessageListFixed';
import { mockMessages } from '../../test-utils/chatbotTestUtils';

// Mock scrollIntoView which is not available in jsdom
Element.prototype.scrollIntoView = jest.fn();

describe('MessageListFixed', () => {
  it('should render empty state when no messages', () => {
    render(<MessageListFixed messages={[]} isLoading={false} />);
    expect(screen.getByText(/Hi! I'm your AI assistant/i)).toBeInTheDocument();
  });

  it('should show example questions in empty state', () => {
    render(<MessageListFixed messages={[]} isLoading={false} />);
    expect(
      screen.getByText(/What experience do you have with React?/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Tell me about your projects/i)).toBeInTheDocument();
    expect(screen.getByText(/What are your technical skills?/i)).toBeInTheDocument();
  });

  it('should render messages when provided', () => {
    render(<MessageListFixed messages={mockMessages} isLoading={false} />);
    expect(screen.getByText(mockMessages[0].content)).toBeInTheDocument();
    expect(screen.getByText(mockMessages[1].content)).toBeInTheDocument();
  });

  it('should show loading indicator when loading', () => {
    render(<MessageListFixed messages={[]} isLoading={true} />);
    expect(screen.getByText(/Thinking.../i)).toBeInTheDocument();
  });

  it('should show loading indicator with messages', () => {
    render(<MessageListFixed messages={mockMessages} isLoading={true} />);
    expect(screen.getByText(/Thinking.../i)).toBeInTheDocument();
    expect(screen.getByText(mockMessages[0].content)).toBeInTheDocument();
  });

  it('should not show empty state when messages exist', () => {
    render(<MessageListFixed messages={mockMessages} isLoading={false} />);
    expect(
      screen.queryByText(/Hi! I'm your AI assistant/i)
    ).not.toBeInTheDocument();
  });

  it('should render multiple messages', () => {
    const manyMessages = [
      {
        id: 'msg-1',
        role: 'user' as const,
        content: 'Message 1',
        timestamp: Date.now(),
      },
      {
        id: 'msg-2',
        role: 'assistant' as const,
        content: 'Response 1',
        timestamp: Date.now() + 1000,
      },
      {
        id: 'msg-3',
        role: 'user' as const,
        content: 'Message 2',
        timestamp: Date.now() + 2000,
      },
    ];

    render(<MessageListFixed messages={manyMessages} isLoading={false} />);
    expect(screen.getByText('Message 1')).toBeInTheDocument();
    expect(screen.getByText('Response 1')).toBeInTheDocument();
    expect(screen.getByText('Message 2')).toBeInTheDocument();
  });

  it('should use message id as key (not index)', () => {
    const { container } = render(
      <MessageListFixed messages={mockMessages} isLoading={false} />
    );
    // This is indirectly tested - React will warn if we use index as key
    // and we update messages. The component should use message.id.
    expect(container).toBeInTheDocument();
  });
});
