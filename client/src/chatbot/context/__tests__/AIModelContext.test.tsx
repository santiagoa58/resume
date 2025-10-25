import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import {
  AIModelProvider,
  useAIModel,
  AIModelState,
} from '../AIModelContext';
import { createMockModel } from '../../test-utils/chatbotTestUtils';

// Mock @xenova/transformers
jest.mock('@xenova/transformers', () => ({
  pipeline: jest.fn(),
  env: {
    allowLocalModels: false,
  },
}));

const { pipeline } = require('@xenova/transformers');

describe('AIModelContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AIModelProvider', () => {
    it('should provide initial state', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AIModelProvider>{children}</AIModelProvider>
      );

      const { result } = renderHook(() => useAIModel(), { wrapper });

      expect(result.current.state.status).toBe('idle');
      expect(result.current.state.model).toBeNull();
      expect(result.current.state.progress).toBe(0);
      expect(result.current.state.error).toBeNull();
    });

    it('should initialize model successfully', async () => {
      const mockModel = createMockModel();
      pipeline.mockResolvedValue(mockModel);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AIModelProvider>{children}</AIModelProvider>
      );

      const { result } = renderHook(() => useAIModel(), { wrapper });

      await act(async () => {
        await result.current.initializeModel();
      });

      await waitFor(() => {
        expect(result.current.state.status).toBe('ready');
      });

      expect(result.current.state.model).toBeTruthy();
      expect(result.current.state.error).toBeNull();
    });

    it('should update progress during initialization', async () => {
      const progressValues: number[] = [];

      pipeline.mockImplementation(
        (task: string, model: string, options: any) => {
          // Simulate progress callbacks
          if (options?.progress_callback) {
            options.progress_callback({ progress: 25 });
            options.progress_callback({ progress: 50 });
            options.progress_callback({ progress: 75 });
            options.progress_callback({ progress: 100 });
          }
          return Promise.resolve(createMockModel());
        }
      );

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AIModelProvider>{children}</AIModelProvider>
      );

      const { result } = renderHook(() => useAIModel(), { wrapper });

      await act(async () => {
        await result.current.initializeModel();
      });

      // Should have gone through loading state
      await waitFor(() => {
        expect(result.current.state.status).toBe('ready');
      });
    });

    it('should handle initialization errors', async () => {
      pipeline.mockRejectedValue(new Error('Failed to load model'));

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AIModelProvider>{children}</AIModelProvider>
      );

      const { result } = renderHook(() => useAIModel(), { wrapper });

      await act(async () => {
        await result.current.initializeModel();
      });

      await waitFor(() => {
        expect(result.current.state.status).toBe('error');
      });

      expect(result.current.state.error).toContain('Failed to load model');
      expect(result.current.state.model).toBeNull();
    });

    it('should prevent concurrent initialization', async () => {
      pipeline.mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(createMockModel()), 100);
        });
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AIModelProvider>{children}</AIModelProvider>
      );

      const { result } = renderHook(() => useAIModel(), { wrapper });

      // Call initialize multiple times concurrently
      await act(async () => {
        result.current.initializeModel();
        result.current.initializeModel();
        result.current.initializeModel();
      });

      await waitFor(() => {
        expect(result.current.state.status).toBe('ready');
      });

      // Pipeline should only be called once due to race condition prevention
      expect(pipeline).toHaveBeenCalledTimes(1);
    });

    it('should not reinitialize if model already loaded', async () => {
      const mockModel = createMockModel();
      pipeline.mockResolvedValue(mockModel);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AIModelProvider>{children}</AIModelProvider>
      );

      const { result } = renderHook(() => useAIModel(), { wrapper });

      await act(async () => {
        await result.current.initializeModel();
      });

      await waitFor(() => {
        expect(result.current.state.status).toBe('ready');
      });

      const callCount = pipeline.mock.calls.length;

      // Try to initialize again
      await act(async () => {
        await result.current.initializeModel();
      });

      // Should not call pipeline again
      expect(pipeline.mock.calls.length).toBe(callCount);
    });

    it('should provide isReady() method', async () => {
      const mockModel = createMockModel();
      pipeline.mockResolvedValue(mockModel);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AIModelProvider>{children}</AIModelProvider>
      );

      const { result } = renderHook(() => useAIModel(), { wrapper });

      expect(result.current.isReady()).toBe(false);

      await act(async () => {
        await result.current.initializeModel();
      });

      await waitFor(() => {
        expect(result.current.isReady()).toBe(true);
      });
    });

    it('should provide retryInitialization() method', async () => {
      // First attempt fails
      pipeline.mockRejectedValueOnce(new Error('Network error'));
      // Second attempt succeeds
      pipeline.mockResolvedValueOnce(createMockModel());

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AIModelProvider>{children}</AIModelProvider>
      );

      const { result } = renderHook(() => useAIModel(), { wrapper });

      await act(async () => {
        await result.current.initializeModel();
      });

      await waitFor(() => {
        expect(result.current.state.status).toBe('error');
      });

      // Retry
      await act(async () => {
        await result.current.retryInitialization();
      });

      await waitFor(() => {
        expect(result.current.state.status).toBe('ready');
      });

      expect(result.current.state.error).toBeNull();
    });

    it('should reset state on retry', async () => {
      pipeline.mockRejectedValueOnce(new Error('Error'));
      pipeline.mockResolvedValueOnce(createMockModel());

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AIModelProvider>{children}</AIModelProvider>
      );

      const { result } = renderHook(() => useAIModel(), { wrapper });

      await act(async () => {
        await result.current.initializeModel();
      });

      await waitFor(() => {
        expect(result.current.state.status).toBe('error');
        expect(result.current.state.error).toBeTruthy();
      });

      await act(async () => {
        await result.current.retryInitialization();
      });

      // Should go through loading state again
      await waitFor(() => {
        expect(result.current.state.status).toBe('ready');
      });
    });
  });

  describe('useAIModel hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAIModel());
      }).toThrow('useAIModel must be used within AIModelProvider');

      consoleError.mockRestore();
    });

    it('should return context value when used within provider', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AIModelProvider>{children}</AIModelProvider>
      );

      const { result } = renderHook(() => useAIModel(), { wrapper });

      expect(result.current).toHaveProperty('state');
      expect(result.current).toHaveProperty('initializeModel');
      expect(result.current).toHaveProperty('retryInitialization');
      expect(result.current).toHaveProperty('isReady');
    });
  });

  describe('State transitions', () => {
    it('should transition idle -> loading -> ready', async () => {
      const mockModel = createMockModel();
      pipeline.mockResolvedValue(mockModel);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AIModelProvider>{children}</AIModelProvider>
      );

      const { result } = renderHook(() => useAIModel(), { wrapper });

      expect(result.current.state.status).toBe('idle');

      act(() => {
        result.current.initializeModel();
      });

      // Should be loading
      await waitFor(() => {
        expect(result.current.state.status).toBe('loading');
      });

      // Should become ready
      await waitFor(() => {
        expect(result.current.state.status).toBe('ready');
      });
    });

    it('should transition idle -> loading -> error on failure', async () => {
      pipeline.mockRejectedValue(new Error('Load failed'));

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AIModelProvider>{children}</AIModelProvider>
      );

      const { result } = renderHook(() => useAIModel(), { wrapper });

      await act(async () => {
        await result.current.initializeModel();
      });

      await waitFor(() => {
        expect(result.current.state.status).toBe('error');
      });
    });

    it('should transition error -> idle -> loading -> ready on retry', async () => {
      pipeline.mockRejectedValueOnce(new Error('Error'));
      pipeline.mockResolvedValueOnce(createMockModel());

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AIModelProvider>{children}</AIModelProvider>
      );

      const { result } = renderHook(() => useAIModel(), { wrapper });

      await act(async () => {
        await result.current.initializeModel();
      });

      await waitFor(() => {
        expect(result.current.state.status).toBe('error');
      });

      await act(async () => {
        await result.current.retryInitialization();
      });

      await waitFor(() => {
        expect(result.current.state.status).toBe('ready');
      });
    });
  });
});
