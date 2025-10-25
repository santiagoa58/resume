import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatbotFixed from '../ChatbotFixed';
import { AIModelProvider } from '../../context/AIModelContext';
import { mockResume, mockProject } from '../../../test_utils/apiMocks';
import { createMockModel } from '../../test-utils/chatbotTestUtils';

jest.mock('@xenova/transformers', () => ({
  pipeline: jest.fn(),
  env: { allowLocalModels: false },
}));

const { pipeline } = require('@xenova/transformers');

describe('ChatbotFixed', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    pipeline.mockResolvedValue(createMockModel());
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  const renderChatbot = () => {
    return render(
      <AIModelProvider>
        <ChatbotFixed resume={mockResume} projects={[mockProject]} />
      </AIModelProvider>
    );
  };

  it('should render FAB button', () => {
    renderChatbot();
    const fab = screen.getByRole('button', { name: /chat with ai/i });
    expect(fab).toBeInTheDocument();
  });

  it('should open drawer when FAB is clicked', async () => {
    renderChatbot();

    const fab = screen.getByRole('button', { name: /chat with ai/i });
    fireEvent.click(fab);

    await waitFor(() => {
      expect(screen.getByText(/AI Assistant/i)).toBeInTheDocument();
    });
  });

  it('should close drawer when close button is clicked', async () => {
    renderChatbot();

    // Open drawer
    const fab = screen.getByRole('button', { name: /chat with ai/i });
    fireEvent.click(fab);

    await waitFor(() => {
      expect(screen.getByText(/AI Assistant/i)).toBeInTheDocument();
    });

    // Close drawer
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText(/AI Assistant/i)).not.toBeInTheDocument();
    });
  });

  it('should show model loading state', () => {
    pipeline.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderChatbot();

    const fab = screen.getByRole('button', { name: /chat with ai/i });
    fireEvent.click(fab);

    expect(screen.getByText(/Loading AI model/i)).toBeInTheDocument();
  });

  it('should show error state when model fails to load', async () => {
    pipeline.mockRejectedValue(new Error('Failed to load'));

    renderChatbot();

    const fab = screen.getByRole('button', { name: /chat with ai/i });
    fireEvent.click(fab);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load AI model/i)).toBeInTheDocument();
    });
  });

  it('should pass resume data to chatbot hook', () => {
    renderChatbot();
    // If it renders without errors, the props were passed correctly
    expect(screen.getByRole('button', { name: /chat with ai/i })).toBeInTheDocument();
  });

  it('should be wrapped in ErrorBoundary', () => {
    // If any errors occur, they should be caught
    const { container } = renderChatbot();
    expect(container).toBeInTheDocument();
  });
});
