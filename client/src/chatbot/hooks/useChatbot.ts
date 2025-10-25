import { useState, useCallback, useEffect, useRef } from 'react';
import {
  ChatMessage,
  initializeModel,
  generateResponse,
  isModelReady,
  ModelStatus,
} from '../utils/aiModel';
import {
  createKnowledgeBase,
  extractRelevantContext,
} from '../utils/knowledgeBase';
import { IResume, IProject } from '../../types/api_types';

export interface UseChatbotReturn {
  messages: ChatMessage[];
  sendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  modelStatus: ModelStatus;
  modelProgress: number;
  error: string | null;
  clearMessages: () => void;
}

export const useChatbot = (
  resume: IResume | undefined,
  projects: IProject[]
): UseChatbotReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState<ModelStatus>('idle');
  const [modelProgress, setModelProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const knowledgeBaseRef = useRef<string>('');

  // Initialize model on mount
  useEffect(() => {
    const init = async () => {
      try {
        setModelStatus('loading');
        await initializeModel((progress: any) => {
          // Calculate progress percentage
          if (progress?.progress !== undefined) {
            setModelProgress(Math.round(progress.progress));
          }
        });
        setModelStatus('ready');
        setError(null);
      } catch (err) {
        setModelStatus('error');
        setError(
          err instanceof Error ? err.message : 'Failed to load AI model'
        );
      }
    };

    init();
  }, []);

  // Update knowledge base when resume or projects change
  useEffect(() => {
    knowledgeBaseRef.current = createKnowledgeBase(resume, projects);
  }, [resume, projects]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;
      if (!isModelReady()) {
        setError('AI model is not ready yet. Please wait...');
        return;
      }

      const userMessage: ChatMessage = {
        role: 'user',
        content: content.trim(),
      };

      // Add user message to chat
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        // Extract relevant context for this question
        const relevantContext = extractRelevantContext(
          knowledgeBaseRef.current,
          content
        );

        // Get conversation history (last 5 messages for context)
        const conversationHistory = [...messages, userMessage].slice(-5);

        // Generate AI response
        const responseText = await generateResponse(
          conversationHistory,
          relevantContext
        );

        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: responseText,
        };

        // Add assistant response to chat
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to generate response'
        );

        // Add error message to chat
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content:
            'I apologize, but I encountered an error. Please try asking your question again.',
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    modelStatus,
    modelProgress,
    error,
    clearMessages,
  };
};
