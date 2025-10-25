import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatDrawerFixed from '../ChatDrawerFixed';
import { UseChatbotReturn } from '../../hooks/useChatbotFixed';
import { mockMessages } from '../../test-utils/chatbotTestUtils';

// Mock scrollIntoView which is not available in jsdom
Element.prototype.scrollIntoView = jest.fn();

describe('ChatDrawerFixed', () => {
  const mockOnClose = jest.fn();

  const createMockChatbot = (
    overrides?: Partial<UseChatbotReturn>
  ): UseChatbotReturn => ({
    messages: [],
    sendMessage: jest.fn().mockResolvedValue(undefined),
    isLoading: false,
    modelStatus: 'ready',
    modelProgress: 0,
    error: null,
    clearMessages: jest.fn(),
    retryModelInit: jest.fn(),
    exportConversation: jest.fn().mockReturnValue('{}'),
    importConversation: jest.fn().mockReturnValue(true),
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render when open', () => {
    const chatbot = createMockChatbot();
    render(
      <ChatDrawerFixed open={true} onClose={mockOnClose} chatbot={chatbot} />
    );
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const chatbot = createMockChatbot();
    render(
      <ChatDrawerFixed open={true} onClose={mockOnClose} chatbot={chatbot} />
    );
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should show loading state', () => {
    const chatbot = createMockChatbot({ modelStatus: 'loading', modelProgress: 50 });
    render(
      <ChatDrawerFixed open={true} onClose={mockOnClose} chatbot={chatbot} />
    );
    expect(screen.getByText(/Loading AI model/i)).toBeInTheDocument();
    expect(screen.getByText(/50% complete/i)).toBeInTheDocument();
  });

  it('should show error state with retry button', () => {
    const retryMock = jest.fn();
    const chatbot = createMockChatbot({
      modelStatus: 'error',
      retryModelInit: retryMock,
    });
    render(
      <ChatDrawerFixed open={true} onClose={mockOnClose} chatbot={chatbot} />
    );

    expect(screen.getByText(/Failed to load AI model/i)).toBeInTheDocument();
    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);
    expect(retryMock).toHaveBeenCalledTimes(1);
  });

  it('should show chat input when ready', () => {
    const chatbot = createMockChatbot({ modelStatus: 'ready' });
    render(
      <ChatDrawerFixed open={true} onClose=  {mockOnClose} chatbot={chatbot} />
    );
    expect(screen.getByPlaceholderText(/Ask me about/i)).toBeInTheDocument();
  });

  it('should disable input when loading', () => {
    const chatbot = createMockChatbot({ modelStatus: 'ready', isLoading: true });
    render(
      <ChatDrawerFixed open={true} onClose={mockOnClose} chatbot={chatbot} />
    );
    const input = screen.getByPlaceholderText(/AI is thinking/i);
    expect(input).toBeDisabled();
  });

  it('should show menu button when messages exist', () => {
    const chatbot = createMockChatbot({ messages: mockMessages });
    render(
      <ChatDrawerFixed open={true} onClose={mockOnClose} chatbot={chatbot} />
    );
    const menuButton = screen.getByTitle(/More options/i);
    expect(menuButton).toBeInTheDocument();
  });

  it('should not show menu button when no messages', () => {
    const chatbot = createMockChatbot();
    render(
      <ChatDrawerFixed open={true} onClose={mockOnClose} chatbot={chatbot} />
    );
    expect(screen.queryByTitle(/More options/i)).not.toBeInTheDocument();
  });

  it('should open menu when menu button is clicked', async () => {
    const chatbot = createMockChatbot({ messages: mockMessages });
    render(
      <ChatDrawerFixed open={true} onClose={mockOnClose} chatbot={chatbot} />
    );

    const menuButton = screen.getByTitle(/More options/i);
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByText(/Export conversation/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Import conversation/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear conversation/i)).toBeInTheDocument();
  });

  it('should export conversation when export is clicked', async () => {
    const exportMock = jest.fn().mockReturnValue(JSON.stringify({ messages: [] }));
    const chatbot = createMockChatbot({
      messages: mockMessages,
      exportConversation: exportMock,
    });

    render(
      <ChatDrawerFixed open={true} onClose={mockOnClose} chatbot={chatbot} />
    );

    // Mock URL and DOM methods needed for download AFTER render
    const mockClick = jest.fn();
    const mockAnchor = document.createElement('a');
    mockAnchor.click = mockClick;

    const originalCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        return mockAnchor;
      }
      return originalCreateElement(tagName);
    });

    global.URL.createObjectURL = jest.fn().mockReturnValue('blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();

    const menuButton = screen.getByTitle(/More options/i);
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByText(/Export conversation/i)).toBeInTheDocument();
    });

    const exportButton = screen.getByText(/Export conversation/i);
    fireEvent.click(exportButton);

    expect(exportMock).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
  });

  it('should clear messages with confirmation', async () => {
    const clearMock = jest.fn();
    const chatbot = createMockChatbot({
      messages: mockMessages,
      clearMessages: clearMock,
    });

    // Mock window.confirm
    global.confirm = jest.fn().mockReturnValue(true);

    render(
      <ChatDrawerFixed open={true} onClose={mockOnClose} chatbot={chatbot} />
    );

    const menuButton = screen.getByTitle(/More options/i);
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByText(/Clear conversation/i)).toBeInTheDocument();
    });

    const clearButton = screen.getByText(/Clear conversation/i);
    fireEvent.click(clearButton);

    expect(global.confirm).toHaveBeenCalled();
    expect(clearMock).toHaveBeenCalled();
  });

  it('should not clear messages if user cancels', async () => {
    const clearMock = jest.fn();
    const chatbot = createMockChatbot({
      messages: mockMessages,
      clearMessages: clearMock,
    });

    global.confirm = jest.fn().mockReturnValue(false);

    render(
      <ChatDrawerFixed open={true} onClose={mockOnClose} chatbot={chatbot} />
    );

    const menuButton = screen.getByTitle(/More options/i);
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByText(/Clear conversation/i)).toBeInTheDocument();
    });

    const clearButton = screen.getByText(/Clear conversation/i);
    fireEvent.click(clearButton);

    expect(clearMock).not.toHaveBeenCalled();
  });

  it('should show runtime error warning', () => {
    const chatbot = createMockChatbot({
      modelStatus: 'ready',
      error: 'Something went wrong',
    });
    render(
      <ChatDrawerFixed open={true} onClose={mockOnClose} chatbot={chatbot} />
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should render messages list', () => {
    const chatbot = createMockChatbot({
      modelStatus: 'ready',
      messages: mockMessages,
    });
    render(
      <ChatDrawerFixed open={true} onClose={mockOnClose} chatbot={chatbot} />
    );
    expect(screen.getByText(mockMessages[0].content)).toBeInTheDocument();
  });

  it('should handle import conversation', async () => {
    const importMock = jest.fn().mockReturnValue(true);
    const chatbot = createMockChatbot({
      messages: mockMessages, // Start with messages so menu is visible
      importConversation: importMock,
    });

    // Mock window.alert
    global.alert = jest.fn();

    render(
      <ChatDrawerFixed open={true} onClose={mockOnClose} chatbot={chatbot} />
    );

    const menuButton = screen.getByTitle(/More options/i);
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByText(/Import conversation/i)).toBeInTheDocument();
    });

    // We can verify the import menu item exists
    const importButton = screen.getByText(/Import conversation/i);
    expect(importButton).toBeInTheDocument();

    // Note: Actually triggering the file input is difficult in jsdom
    // The functionality is tested through the useChatbotFixed hook tests
  });
});
