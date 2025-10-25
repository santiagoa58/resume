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

// TODO: [MEDIUM] Add analytics interface for tracking chatbot usage
// interface ChatAnalytics {
//   totalMessages: number;
//   avgResponseTime: number;
//   commonQuestions: Map<string, number>;
//   errorRate: number;
// }

export interface UseChatbotReturn {
  messages: ChatMessage[];
  sendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  modelStatus: ModelStatus;
  modelProgress: number;
  error: string | null;
  clearMessages: () => void;
  // TODO: [LOW] Add retryLastMessage function for failed generations
  // TODO: [LOW] Add cancelGeneration function for long-running requests
  // TODO: [LOW] Add exportChat function to save conversation
  // TODO: [LOW] Add analytics getter
}

// TODO: [MEDIUM] Consider moving this to React Context for global access
// Multiple components might want to interact with the chatbot

/**
 * Custom hook for managing chatbot state and interactions
 *
 * TODO: [HIGH] Add error boundary integration
 * TODO: [MEDIUM] Add persistence (save conversation to localStorage)
 * TODO: [MEDIUM] Add rate limiting to prevent spam/abuse
 * TODO: [LOW] Add conversation summarization for long chats
 */
export const useChatbot = (
  resume: IResume | undefined,
  projects: IProject[]
): UseChatbotReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // TODO: [MEDIUM] Load messages from localStorage on mount for persistence
  // TODO: [LOW] Add message ID generation for better React key management

  const [isLoading, setIsLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState<ModelStatus>('idle');
  const [modelProgress, setModelProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const knowledgeBaseRef = useRef<string>('');

  // TODO: [MEDIUM] Add request queue ref to prevent concurrent generations
  // const requestQueueRef = useRef<Promise<void> | null>(null);

  // TODO: [LOW] Add analytics ref
  // const analyticsRef = useRef<ChatAnalytics>({...});

  // TODO: [HIGH] This useEffect has no cleanup - potential memory leak
  // If component unmounts during model loading, callbacks still fire
  // Add cleanup: return () => { /* cancel loading */ };
  // Initialize model on mount
  useEffect(() => {
    const init = async () => {
      try {
        setModelStatus('loading');
        await initializeModel((progress: any) => {
          // TODO: [MEDIUM] Type this properly
          // Calculate progress percentage
          if (progress?.progress !== undefined) {
            setModelProgress(Math.round(progress.progress));
          }
          // TODO: [LOW] Track download speed and ETA
          // TODO: [LOW] Show which file is being downloaded
        });
        setModelStatus('ready');
        setError(null);
        // TODO: [LOW] Track successful load time for analytics
        // TODO: [LOW] Trigger welcome message or onboarding
      } catch (err) {
        setModelStatus('error');
        setError(
          err instanceof Error ? err.message : 'Failed to load AI model'
        );
        // TODO: [HIGH] Add retry mechanism with exponential backoff
        // TODO: [MEDIUM] Categorize error types (network, memory, browser incompatibility)
        // TODO: [LOW] Send error telemetry
      }
    };

    init();
    // TODO: [HIGH] Add cleanup function
    // return () => { /* abort model loading if in progress */ };
  }, []);

  // TODO: [HIGH] MEMORY LEAK: Regenerates knowledge base on EVERY projects array reference change
  // Projects array from context might get new reference on every render even if data is same
  // FIX: Use useMemo with deep equality check or stable reference from context
  // Update knowledge base when resume or projects change
  useEffect(() => {
    knowledgeBaseRef.current = createKnowledgeBase(resume, projects);
    // TODO: [MEDIUM] Memoize createKnowledgeBase result
    // TODO: [LOW] Validate knowledge base size doesn't exceed limits
    // TODO: [LOW] Log knowledge base creation for debugging
  }, [resume, projects]);

  // TODO: [CRITICAL] Stale closure bug - recreates on EVERY message
  // sendMessage depends on `messages`, so it recreates every time messages change
  // This causes all child components to re-render unnecessarily
  // PERFORMANCE IMPACT: Degrades with conversation length
  //
  // FIX: Use functional state updates to remove `messages` dependency:
  // const sendMessage = useCallback(async (content: string) => {
  //   setMessages((prevMessages) => {
  //     // use prevMessages here instead of messages
  //   });
  // }, []); // ✅ Stable reference
  const sendMessage = useCallback(
    async (content: string) => {
      // TODO: [MEDIUM] Add input validation
      // - Max length check (e.g., 500 characters)
      // - Profanity filter
      // - Spam detection (same message repeated)
      // - Rate limiting (max N messages per minute)
      if (!content.trim()) return;

      // TODO: [HIGH] Add request queuing
      // If already generating, queue this request or show "Please wait" message
      // Prevents concurrent generation attempts which can crash browser

      if (!isModelReady()) {
        setError('AI model is not ready yet. Please wait...');
        return;
      }

      // TODO: [LOW] Validate user isn't sending too many messages too fast
      // TODO: [LOW] Track message timestamp for analytics

      const userMessage: ChatMessage = {
        role: 'user',
        content: content.trim(),
        // TODO: [MEDIUM] Add unique ID: id: generateId()
        // TODO: [LOW] Add timestamp: timestamp: Date.now()
      };

      // Add user message to chat
      setMessages((prev) => [...prev, userMessage]);
      // TODO: [MEDIUM] Persist to localStorage after adding message
      setIsLoading(true);
      setError(null);

      // TODO: [LOW] Start timer for response latency tracking

      try {
        // Extract relevant context for this question
        const relevantContext = extractRelevantContext(
          knowledgeBaseRef.current,
          content
        );
        // TODO: [LOW] Log which sections were selected for debugging
        // TODO: [MEDIUM] Validate relevantContext size fits in token budget

        // TODO: [HIGH] Stale closure: uses `messages` from closure, not current state
        // If user sends multiple messages quickly, this will use old message history
        // FIX: Use functional state update:
        // setMessages(prevMessages => {
        //   const conversationHistory = [...prevMessages, userMessage].slice(-5);
        //   // ... rest of logic
        // });
        // Get conversation history (last 5 messages for context)
        const conversationHistory = [...messages, userMessage].slice(-5);
        // TODO: [MEDIUM] Make history length configurable based on token budget
        // TODO: [LOW] Implement conversation summarization for very long chats

        // Generate AI response
        const responseText = await generateResponse(
          conversationHistory,
          relevantContext
        );
        // TODO: [MEDIUM] Add timeout for generation (e.g., 30 seconds max)
        // TODO: [LOW] Track generation time for analytics

        // TODO: [MEDIUM] Validate response before showing
        // - Not empty
        // - Not offensive
        // - Relevant to question
        // - No PII leakage

        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: responseText,
          // TODO: [MEDIUM] Add unique ID
          // TODO: [LOW] Add timestamp
          // TODO: [LOW] Add metadata (generation time, tokens used, context used)
        };

        // Add assistant response to chat
        setMessages((prev) => [...prev, assistantMessage]);
        // TODO: [MEDIUM] Persist to localStorage
        // TODO: [LOW] Track successful response for analytics
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to generate response'
        );
        // TODO: [HIGH] Better error handling based on error type
        // - Network error → "Connection issue, please try again"
        // - Out of memory → "Try closing other tabs and refreshing"
        // - Timeout → "Taking longer than expected, please retry"
        // - Model error → "AI is having trouble, please rephrase"

        // TODO: [MEDIUM] Add retry button in error message
        // TODO: [LOW] Send error analytics

        // Add error message to chat
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content:
            'I apologize, but I encountered an error. Please try asking your question again.',
          // TODO: [LOW] Add error flag to message metadata
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        // TODO: [LOW] Stop timer and record response latency
      }
    },
    [messages] // ⚠️ CRITICAL: Recreates function on every message → performance degradation
  );
  // TODO: [CRITICAL] Remove `messages` dependency and use functional updates

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    // TODO: [MEDIUM] Clear localStorage
    // TODO: [LOW] Confirm with user before clearing (add confirmation dialog)
    // TODO: [LOW] Track clear action for analytics
  }, []);

  // TODO: [MEDIUM] Add useEffect to persist messages to localStorage
  // useEffect(() => {
  //   localStorage.setItem('chatMessages', JSON.stringify(messages));
  // }, [messages]);

  // TODO: [MEDIUM] Add useEffect to load messages from localStorage on mount
  // useEffect(() => {
  //   const saved = localStorage.getItem('chatMessages');
  //   if (saved) setMessages(JSON.parse(saved));
  // }, []);

  // TODO: [LOW] Add conversation stats calculation
  // const stats = useMemo(() => ({
  //   messageCount: messages.length,
  //   avgResponseLength: ...,
  //   conversationDuration: ...
  // }), [messages]);

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

// TODO: [MEDIUM] Add useChatbotContext hook for accessing chatbot from anywhere
// export const useChatbotContext = () => {
//   const context = useContext(ChatbotContext);
//   if (!context) throw new Error('Must be used within ChatbotProvider');
//   return context;
// };

// TODO: [LOW] Add custom hooks for specific chatbot features
// export const useChatbotAnalytics = () => { ... };
// export const useChatbotHistory = () => { ... };
// export const useChatbotSuggestions = () => { ... };
