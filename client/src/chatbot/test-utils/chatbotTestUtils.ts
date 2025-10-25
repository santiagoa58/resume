/**
 * Test utilities and mocks for chatbot testing
 */

import { ChatMessage } from '../utils/generation';

// Mock chat messages
export const mockUserMessage: ChatMessage = {
  id: 'msg-user-1',
  role: 'user',
  content: 'What experience do you have with React?',
  timestamp: Date.now(),
};

export const mockAssistantMessage: ChatMessage = {
  id: 'msg-assistant-1',
  role: 'assistant',
  content:
    'I have extensive experience with React, including building complex applications with hooks, context, and TypeScript.',
  timestamp: Date.now() + 1000,
};

export const mockMessages: ChatMessage[] = [
  mockUserMessage,
  mockAssistantMessage,
];

// Mock Transformers.js pipeline
export const mockPipeline = jest.fn().mockResolvedValue([
  {
    generated_text: 'Mocked AI response',
  },
]);

// Mock TextGenerationPipeline
export const createMockModel = () => {
  const mockModel = jest.fn().mockResolvedValue([
    {
      generated_text:
        'User: Test question\n\nAssistant: I have experience with React and TypeScript. I have been working with these technologies for several years.',
    },
  ]);
  return mockModel as any;
};

// Create mock conversation export data
export const createMockExportData = (messages: ChatMessage[] = mockMessages) => {
  return JSON.stringify({
    version: '1.0',
    exportDate: new Date().toISOString(),
    messages,
  });
};

// Mock localStorage
export const createMockLocalStorage = () => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  };
};

// Helper to wait for async operations
export const waitFor = (ms: number = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock file for import testing
export const createMockFile = (
  content: string,
  filename = 'conversation.json'
) => {
  const blob = new Blob([content], { type: 'application/json' });
  return new File([blob], filename, { type: 'application/json' });
};
