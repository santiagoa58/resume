import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatbotErrorBoundary from '../ChatbotErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Working Component</div>;
};

describe('ChatbotErrorBoundary', () => {
  // Suppress console.error for these tests
  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it('should render children when no error', () => {
    render(
      <ChatbotErrorBoundary>
        <div>Test Content</div>
      </ChatbotErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should catch errors and show error UI', () => {
    render(
      <ChatbotErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ChatbotErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('should show error message', () => {
    render(
      <ChatbotErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ChatbotErrorBoundary>
    );

    expect(
      screen.getByText(/chatbot encountered an unexpected error/i)
    ).toBeInTheDocument();
  });

  it('should show reset button', () => {
    render(
      <ChatbotErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ChatbotErrorBoundary>
    );

    const resetButton = screen.getByRole('button', { name: /reset chatbot/i });
    expect(resetButton).toBeInTheDocument();
  });

  it('should reset error state when reset button is clicked', () => {
    const { rerender } = render(
      <ChatbotErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ChatbotErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();

    const resetButton = screen.getByRole('button', { name: /reset chatbot/i });
    fireEvent.click(resetButton);

    // After reset, should try to render children again
    rerender(
      <ChatbotErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ChatbotErrorBoundary>
    );

    expect(screen.getByText('Working Component')).toBeInTheDocument();
  });

  it('should prevent error from bubbling up', () => {
    // This test verifies the error boundary catches the error
    // and doesn't let it propagate up
    expect(() => {
      render(
        <ChatbotErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ChatbotErrorBoundary>
      );
    }).not.toThrow();
  });

  it('should render multiple children', () => {
    render(
      <ChatbotErrorBoundary>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </ChatbotErrorBoundary>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });

  it('should handle errors in nested components', () => {
    const NestedComponent = () => (
      <div>
        <ThrowError shouldThrow={true} />
      </div>
    );

    render(
      <ChatbotErrorBoundary>
        <NestedComponent />
      </ChatbotErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('should maintain error state across re-renders', () => {
    const { rerender } = render(
      <ChatbotErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ChatbotErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();

    // Re-render without changing error state
    rerender(
      <ChatbotErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ChatbotErrorBoundary>
    );

    // Should still show error
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });
});
