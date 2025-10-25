import { useState, useCallback, useEffect, useRef } from 'react';
import { useAIModel } from '../context/AIModelContext';
import {
  generateResponse,
  ChatMessage,
  generateMessageId,
} from '../utils/generation';
import {
  createKnowledgeBase,
  extractRelevantContext,
} from '../utils/knowledgeBaseOptimized';
import { IResume, IProject } from '../../types/api_types';

export interface UseChatbotReturn {
  messages: ChatMessage[];
  sendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  modelStatus: string;
  modelProgress: number;
  error: string | null;
  clearMessages: () => void;
}

export const useChatbotFixed = (
  resume: IResume | undefined,
  projects: IProject[]
): UseChatbotReturn => {
  const { state: modelState, initializeModel, isReady } = useAIModel();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const knowledgeBaseRef = useRef<string>('');
  const requestQueueRef = useRef<Promise<void>>(Promise.resolve());
  const isMountedRef = useRef(true);

  // Initialize model on mount
  useEffect(() => {
    initializeModel();

    return () => {
      isMountedRef.current = false;
    };
  }, [initializeModel]);

  // Update knowledge base when data changes (memoized)
  useEffect(() => {
    knowledgeBaseRef.current = createKnowledgeBase(resume, projects);
  }, [resume, projects]);

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('chatbot_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(parsed);
      }
    } catch (e) {
      // Ignore parse errors
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('chatbot_messages', JSON.stringify(messages));
      } catch (e) {
        // Ignore storage errors
      }
    }
  }, [messages]);

  // Fixed: No stale closure - uses functional updates
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;
      if (!isReady()) {
        setError('AI model is not ready yet. Please wait...');
        return;
      }

      // Input validation
      if (content.length > 500) {
        setError('Message too long. Please keep it under 500 characters.');
        return;
      }

      const userMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
      };

      // Add user message immediately
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      // Queue the request to prevent concurrent generation
      requestQueueRef.current = requestQueueRef.current.then(async () => {
        if (!isMountedRef.current) return;

        try {
          // Get context
          const relevantContext = extractRelevantContext(
            knowledgeBaseRef.current,
            content
          );

          // Use functional update to get current messages
          let conversationHistory: ChatMessage[] = [];
          setMessages((prev) => {
            conversationHistory = [...prev].slice(-5);
            return prev;
          });

          // Generate response
          const responseText = await generateResponse(
            modelState.model!,
            conversationHistory,
            relevantContext,
            resume?.name
          );

          if (!isMountedRef.current) return;

          const assistantMessage: ChatMessage = {
            id: generateMessageId(),
            role: 'assistant',
            content: responseText,
            timestamp: Date.now(),
          };

          setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
          if (!isMountedRef.current) return;

          const errorMsg =
            err instanceof Error ? err.message : 'Failed to generate response';
          setError(errorMsg);

          const errorMessage: ChatMessage = {
            id: generateMessageId(),
            role: 'assistant',
            content:
              'I apologize, but I encountered an error. Please try again.',
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        } finally {
          if (isMountedRef.current) {
            setIsLoading(false);
          }
        }
      });

      await requestQueueRef.current;
    },
    [isReady, modelState.model, resume?.name]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    try {
      localStorage.removeItem('chatbot_messages');
    } catch (e) {
      // Ignore
    }
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    modelStatus: modelState.status,
    modelProgress: modelState.progress,
    error: error || modelState.error,
    clearMessages,
  };
};
