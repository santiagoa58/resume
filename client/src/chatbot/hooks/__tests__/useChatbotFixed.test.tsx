import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useChatbotFixed } from '../useChatbotFixed';
import { AIModelProvider } from '../../context/AIModelContext';
import { mockResume, mockProject } from '../../../test_utils/apiMocks';
import {
  createMockModel,
  createMockExportData,
  createMockLocalStorage,
  mockMessages,
} from '../../test-utils/chatbotTestUtils';

// Mock dependencies
jest.mock('@xenova/transformers', () => ({
  pipeline: jest.fn(),
  env: { allowLocalModels: false },
}));

jest.mock('../../utils/generation', () => ({
  ...jest.requireActual('../../utils/generation'),
  generateResponse: jest.fn().mockResolvedValue('Mocked AI response'),
}));

const { pipeline } = require('@xenova/transformers');
const { generateResponse } = require('../../utils/generation');

describe('useChatbotFixed', () => {
  let mockLocalStorage: ReturnType<typeof createMockLocalStorage>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage = createMockLocalStorage();
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AIModelProvider>{children}</AIModelProvider>
  );

  describe('Initialization', () => {
    it('should initialize with empty messages', () => {
      pipeline.mockResolvedValue(createMockModel());

      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      expect(result.current.messages).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should initialize model on mount', async () => {
      pipeline.mockResolvedValue(createMockModel());

      renderHook(() => useChatbotFixed(mockResume, [mockProject]), { wrapper });

      await waitFor(() => {
        expect(pipeline).toHaveBeenCalled();
      });
    });

    it('should load messages from localStorage', () => {
      const savedMessages = JSON.stringify(mockMessages);
      mockLocalStorage.setItem('chatbot_messages', savedMessages);

      pipeline.mockResolvedValue(createMockModel());

      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      expect(result.current.messages).toEqual(mockMessages);
    });

    it('should handle invalid localStorage data', () => {
      mockLocalStorage.setItem('chatbot_messages', 'invalid json');

      pipeline.mockResolvedValue(createMockModel());

      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      expect(result.current.messages).toEqual([]);
    });
  });

  describe('sendMessage', () => {
    beforeEach(async () => {
      const mockModel = createMockModel();
      pipeline.mockResolvedValue(mockModel);
    });

    it('should send a message successfully', async () => {
      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      // Wait for model to be ready
      await waitFor(() => {
        expect(result.current.modelStatus).toBe('ready');
      });

      await act(async () => {
        await result.current.sendMessage('Hello, what is your experience?');
      });

      await waitFor(() => {
        expect(result.current.messages.length).toBeGreaterThan(0);
      });

      // Should have user message and assistant response
      expect(result.current.messages.length).toBe(2);
      expect(result.current.messages[0].role).toBe('user');
      expect(result.current.messages[0].content).toBe(
        'Hello, what is your experience?'
      );
      expect(result.current.messages[1].role).toBe('assistant');
    });

    it('should not send empty messages', async () => {
      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.modelStatus).toBe('ready');
      });

      await act(async () => {
        await result.current.sendMessage('');
      });

      expect(result.current.messages.length).toBe(0);
    });

    it('should trim whitespace from messages', async () => {
      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.modelStatus).toBe('ready');
      });

      await act(async () => {
        await result.current.sendMessage('   test message   ');
      });

      await waitFor(() => {
        expect(result.current.messages.length).toBeGreaterThan(0);
      });

      expect(result.current.messages[0].content).toBe('test message');
    });

    it('should reject messages that are too long', async () => {
      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.modelStatus).toBe('ready');
      });

      const longMessage = 'x'.repeat(501);

      await act(async () => {
        await result.current.sendMessage(longMessage);
      });

      expect(result.current.error).toContain('too long');
      expect(result.current.messages.length).toBe(0);
    });

    it('should set loading state during generation', async () => {
      generateResponse.mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve('Response'), 100))
      );

      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.modelStatus).toBe('ready');
      });

      act(() => {
        result.current.sendMessage('Test');
      });

      // Should be loading
      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      // Should stop loading when done
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle generation errors', async () => {
      generateResponse.mockRejectedValue(new Error('Generation failed'));

      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.modelStatus).toBe('ready');
      });

      await act(async () => {
        await result.current.sendMessage('Test');
      });

      await waitFor(() => {
        expect(result.current.error).toContain('Generation failed');
      });

      // Should have user message and error message
      expect(result.current.messages.length).toBe(2);
      expect(result.current.messages[1].content).toContain('error');
    });

    it('should prevent concurrent message sending', async () => {
      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.modelStatus).toBe('ready');
      });

      // Send multiple messages rapidly
      act(() => {
        result.current.sendMessage('Message 1');
        result.current.sendMessage('Message 2');
        result.current.sendMessage('Message 3');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // generateResponse should be called once per message, but sequentially
      expect(generateResponse).toHaveBeenCalledTimes(3);
    });

    it('should save messages to localStorage', async () => {
      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.modelStatus).toBe('ready');
      });

      await act(async () => {
        await result.current.sendMessage('Test');
      });

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'chatbot_messages',
          expect.any(String)
        );
      });
    });

    it('should require model to be ready', async () => {
      pipeline.mockImplementation(() => new Promise(() => {})); // Never resolves

      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      await act(async () => {
        await result.current.sendMessage('Test');
      });

      expect(result.current.error).toContain('not ready');
      expect(result.current.messages.length).toBe(0);
    });
  });

  describe('clearMessages', () => {
    it('should clear all messages', async () => {
      mockLocalStorage.setItem('chatbot_messages', JSON.stringify(mockMessages));
      pipeline.mockResolvedValue(createMockModel());

      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      expect(result.current.messages.length).toBeGreaterThan(0);

      act(() => {
        result.current.clearMessages();
      });

      expect(result.current.messages).toEqual([]);
    });

    it('should clear localStorage', () => {
      pipeline.mockResolvedValue(createMockModel());

      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      act(() => {
        result.current.clearMessages();
      });

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        'chatbot_messages'
      );
    });

    it('should clear error state', async () => {
      pipeline.mockResolvedValue(createMockModel());

      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      // Set an error
      await act(async () => {
        await result.current.sendMessage('x'.repeat(501)); // Too long
      });

      expect(result.current.error).toBeTruthy();

      act(() => {
        result.current.clearMessages();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('exportConversation', () => {
    it('should export conversation as JSON', async () => {
      pipeline.mockResolvedValue(createMockModel());

      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.modelStatus).toBe('ready');
      });

      await act(async () => {
        await result.current.sendMessage('Test message');
      });

      await waitFor(() => {
        expect(result.current.messages.length).toBeGreaterThan(0);
      });

      const exported = result.current.exportConversation();
      const parsed = JSON.parse(exported);

      expect(parsed).toHaveProperty('version', '1.0');
      expect(parsed).toHaveProperty('exportDate');
      expect(parsed).toHaveProperty('messages');
      expect(Array.isArray(parsed.messages)).toBe(true);
    });

    it('should export empty conversation', () => {
      pipeline.mockResolvedValue(createMockModel());

      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      const exported = result.current.exportConversation();
      const parsed = JSON.parse(exported);

      expect(parsed.messages).toEqual([]);
    });
  });

  describe('importConversation', () => {
    it('should import valid conversation data', () => {
      pipeline.mockResolvedValue(createMockModel());

      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      const exportData = createMockExportData();

      act(() => {
        const success = result.current.importConversation(exportData);
        expect(success).toBe(true);
      });

      expect(result.current.messages.length).toBeGreaterThan(0);
    });

    it('should reject invalid JSON', () => {
      pipeline.mockResolvedValue(createMockModel());

      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      act(() => {
        const success = result.current.importConversation('invalid json');
        expect(success).toBe(false);
      });

      expect(result.current.error).toContain('Failed to import');
    });

    it('should reject data without messages array', () => {
      pipeline.mockResolvedValue(createMockModel());

      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      const invalidData = JSON.stringify({ version: '1.0' });

      act(() => {
        const success = result.current.importConversation(invalidData);
        expect(success).toBe(false);
      });

      expect(result.current.error).toContain('Invalid conversation data');
    });

    it('should reject data with invalid message format', () => {
      pipeline.mockResolvedValue(createMockModel());

      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      const invalidData = JSON.stringify({
        version: '1.0',
        messages: [{ content: 'missing required fields' }],
      });

      act(() => {
        const success = result.current.importConversation(invalidData);
        expect(success).toBe(false);
      });

      expect(result.current.error).toContain('Invalid message format');
    });

    it('should clear error on successful import', () => {
      pipeline.mockResolvedValue(createMockModel());

      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      // Set error first
      act(() => {
        result.current.importConversation('invalid');
      });

      expect(result.current.error).toBeTruthy();

      // Import valid data
      const validData = createMockExportData();
      act(() => {
        result.current.importConversation(validData);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Model status and progress', () => {
    it('should expose model status', async () => {
      pipeline.mockResolvedValue(createMockModel());

      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      expect(result.current.modelStatus).toBe('idle');

      await waitFor(() => {
        expect(result.current.modelStatus).toBe('ready');
      });
    });

    it('should expose model progress', async () => {
      pipeline.mockImplementation((task, model, options) => {
        if (options?.progress_callback) {
          options.progress_callback({ progress: 50 });
        }
        return Promise.resolve(createMockModel());
      });

      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.modelProgress).toBeGreaterThan(0);
      });
    });
  });

  describe('Knowledge base integration', () => {
    it('should use resume data for context', async () => {
      pipeline.mockResolvedValue(createMockModel());

      const { result } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.modelStatus).toBe('ready');
      });

      await act(async () => {
        await result.current.sendMessage('Tell me about your skills');
      });

      await waitFor(() => {
        expect(generateResponse).toHaveBeenCalled();
      });

      // Check that context was passed
      const callArgs = generateResponse.mock.calls[0];
      expect(callArgs[2]).toContain(mockResume.name);
    });

    it('should update knowledge base when resume changes', async () => {
      pipeline.mockResolvedValue(createMockModel());

      const { result, rerender } = renderHook(
        ({ resume, projects }) => useChatbotFixed(resume, projects),
        {
          wrapper,
          initialProps: {
            resume: mockResume,
            projects: [mockProject],
          },
        }
      );

      const updatedResume = {
        ...mockResume,
        name: 'Updated Name',
      };

      rerender({ resume: updatedResume, projects: [mockProject] });

      await waitFor(() => {
        expect(result.current.modelStatus).toBe('ready');
      });

      await act(async () => {
        await result.current.sendMessage('Hello');
      });

      await waitFor(() => {
        expect(generateResponse).toHaveBeenCalled();
      });

      const callArgs = generateResponse.mock.calls[0];
      expect(callArgs[2]).toContain('Updated Name');
    });
  });

  describe('Cleanup', () => {
    it('should cleanup on unmount', async () => {
      pipeline.mockResolvedValue(createMockModel());

      const { unmount } = renderHook(
        () => useChatbotFixed(mockResume, [mockProject]),
        { wrapper }
      );

      unmount();

      // Should not cause any errors
      expect(true).toBe(true);
    });
  });
});
