import React, { FC, useState } from 'react';
import ChatFab from './ChatFab';
import ChatDrawer from './ChatDrawer';
import { useChatbot } from '../hooks/useChatbot';
import { IResume, IProject } from '../../types/api_types';

// TODO: [HIGH] Wrap in ErrorBoundary to prevent chatbot crashes from taking down entire app
// import { ErrorBoundary } from 'react-error-boundary';

// TODO: [MEDIUM] Add keyboard shortcut to open/close chatbot (e.g., Cmd+K)
// TODO: [MEDIUM] Add analytics tracking for chatbot interactions
// TODO: [LOW] Add A/B testing capability (different prompts, models, etc.)

interface ChatbotProps {
  resume: IResume | undefined;
  projects: IProject[];
  // TODO: [LOW] Add optional config prop
  // config?: {
  //   modelName?: string;
  //   maxTokens?: number;
  //   theme?: 'light' | 'dark' | 'auto';
  // };
}

/**
 * Main Chatbot component - manages FAB and Drawer
 *
 * TODO: [HIGH] Add Error Boundary wrapper
 * TODO: [MEDIUM] Add lazy loading - only load AI when user clicks FAB
 * TODO: [MEDIUM] Add keyboard accessibility (Esc to close, Tab navigation)
 * TODO: [LOW] Add guided tour/onboarding for first-time users
 * TODO: [LOW] Add "minimize" state (collapsed but not fully closed)
 */
const Chatbot: FC<ChatbotProps> = ({ resume, projects }) => {
  const [isOpen, setIsOpen] = useState(false);
  // TODO: [MEDIUM] Persist isOpen state to localStorage for UX continuity
  // TODO: [LOW] Track how many times user opens/closes chatbot

  const chatbot = useChatbot(resume, projects);
  // TODO: [HIGH] This loads AI model immediately on mount
  // OPTIMIZATION: Only initialize when user first opens drawer
  // Move useChatbot into ChatDrawer or lazy load with dynamic import

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    // TODO: [LOW] Track toggle event for analytics
    // TODO: [LOW] Add haptic feedback on mobile devices
  };

  // TODO: [MEDIUM] Add keyboard event listener for shortcuts
  // useEffect(() => {
  //   const handleKeyPress = (e: KeyboardEvent) => {
  //     if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
  //       e.preventDefault();
  //       handleToggle();
  //     }
  //   };
  //   window.addEventListener('keydown', handleKeyPress);
  //   return () => window.removeEventListener('keydown', handleKeyPress);
  // }, []);

  return (
    <>
      {/* TODO: [HIGH] Wrap entire component in ErrorBoundary */}
      {/* <ErrorBoundary FallbackComponent={ChatbotErrorFallback}> */}
      <ChatFab onClick={handleToggle} modelStatus={chatbot.modelStatus} />
      {/* TODO: [MEDIUM] Add animation/transition when opening drawer */}
      {/* TODO: [LOW] Add sound effect on open (optional, user preference) */}
      <ChatDrawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        chatbot={chatbot}
      />
      {/* </ErrorBoundary> */}
    </>
  );
};

export default Chatbot;

// TODO: [HIGH] Add Error Fallback Component
// const ChatbotErrorFallback: FC<FallbackProps> = ({ error, resetErrorBoundary }) => (
//   <Box>
//     <Typography>Chatbot encountered an error: {error.message}</Typography>
//     <Button onClick={resetErrorBoundary}>Retry</Button>
//   </Box>
// );

// TODO: [MEDIUM] Add lazy loading wrapper
// export default React.lazy(() => import('./Chatbot'));

// TODO: [LOW] Add HOC for feature flags
// export default withFeatureFlag('chatbot_enabled')(Chatbot);
