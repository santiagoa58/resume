import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';
import { pipeline, env, TextGenerationPipeline } from '@xenova/transformers';

// Configure environment
env.allowLocalModels = false;

// Types
export type ModelStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface AIModelState {
  model: TextGenerationPipeline | null;
  status: ModelStatus;
  progress: number;
  error: string | null;
}

type AIModelAction =
  | { type: 'LOADING_START' }
  | { type: 'LOADING_PROGRESS'; payload: number }
  | { type: 'LOADING_SUCCESS'; payload: TextGenerationPipeline }
  | { type: 'LOADING_ERROR'; payload: string }
  | { type: 'RESET' };

interface AIModelContextType {
  state: AIModelState;
  initializeModel: () => Promise<void>;
  retryInitialization: () => Promise<void>;
  isReady: () => boolean;
}

// Context
const AIModelContext = createContext<AIModelContextType | null>(null);

// Reducer
const aiModelReducer = (
  state: AIModelState,
  action: AIModelAction
): AIModelState => {
  switch (action.type) {
    case 'LOADING_START':
      return {
        ...state,
        status: 'loading',
        progress: 0,
        error: null,
      };
    case 'LOADING_PROGRESS':
      return {
        ...state,
        progress: action.payload,
      };
    case 'LOADING_SUCCESS':
      return {
        ...state,
        model: action.payload,
        status: 'ready',
        progress: 100,
        error: null,
      };
    case 'LOADING_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.payload,
      };
    case 'RESET':
      return {
        model: null,
        status: 'idle',
        progress: 0,
        error: null,
      };
    default:
      return state;
  }
};

// Initial state
const initialState: AIModelState = {
  model: null,
  status: 'idle',
  progress: 0,
  error: null,
};

// Provider
export const AIModelProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(aiModelReducer, initialState);
  const initializingRef = React.useRef(false);

  const initializeModel = useCallback(async () => {
    // Prevent concurrent initialization attempts (fixes race condition)
    if (initializingRef.current || state.status === 'loading') {
      return;
    }
    if (state.model) {
      return; // Already initialized
    }

    initializingRef.current = true;
    dispatch({ type: 'LOADING_START' });

    try {
      const progressCallback = (progress: any) => {
        if (progress?.progress !== undefined) {
          dispatch({
            type: 'LOADING_PROGRESS',
            payload: Math.round(progress.progress),
          });
        }
      };

      const model = await pipeline(
        'text-generation',
        'Xenova/Qwen2.5-0.5B-Instruct',
        { progress_callback: progressCallback }
      );

      dispatch({ type: 'LOADING_SUCCESS', payload: model });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load model';
      dispatch({ type: 'LOADING_ERROR', payload: errorMessage });
    } finally {
      initializingRef.current = false;
    }
  }, [state.model, state.status]);

  const retryInitialization = useCallback(async () => {
    // Reset state and retry initialization
    dispatch({ type: 'RESET' });
    initializingRef.current = false;
    await initializeModel();
  }, [initializeModel]);

  const isReady = useCallback(() => {
    return state.status === 'ready' && state.model !== null;
  }, [state.status, state.model]);

  const value: AIModelContextType = {
    state,
    initializeModel,
    retryInitialization,
    isReady,
  };

  return (
    <AIModelContext.Provider value={value}>{children}</AIModelContext.Provider>
  );
};

// Hook
export const useAIModel = (): AIModelContextType => {
  const context = useContext(AIModelContext);
  if (!context) {
    throw new Error('useAIModel must be used within AIModelProvider');
  }
  return context;
};
