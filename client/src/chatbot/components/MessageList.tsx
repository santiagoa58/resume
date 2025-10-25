import React, { FC, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import ChatMessage from './ChatMessage';
import { ChatMessage as ChatMessageType } from '../utils/aiModel';

interface MessageListProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  // TODO: [LOW] Add optional onMessageClick handler for message actions
  // TODO: [LOW] Add optional showTimestamps prop
}

/**
 * Displays list of chat messages with auto-scroll
 *
 * TODO: [MEDIUM] Add virtualization for long conversations (react-window or react-virtuoso)
 * Currently all messages render at once - could cause performance issues with 100+ messages
 *
 * TODO: [MEDIUM] Add "scroll to bottom" button when user scrolls up
 * TODO: [LOW] Add date separators between messages from different days
 * TODO: [LOW] Add typing indicator animation (three bouncing dots)
 * TODO: [LOW] Add message grouping (consecutive messages from same sender)
 */
const MessageList: FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // TODO: [LOW] Track whether user has manually scrolled up
  // const [userScrolledUp, setUserScrolledUp] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // TODO: [MEDIUM] Only auto-scroll if user hasn't manually scrolled up
    // TODO: [LOW] Add option to disable auto-scroll
    // TODO: [LOW] Use IntersectionObserver to detect if user is at bottom
  }, [messages, isLoading]);

  // TODO: [MEDIUM] Add scroll event handler to detect manual scrolling
  // const handleScroll = (e: React.UIEvent<HTMLElement>) => {
  //   const element = e.currentTarget;
  //   const isAtBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
  //   setUserScrolledUp(!isAtBottom);
  // };

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        // TODO: [LOW] Add custom scrollbar styling
        // TODO: [LOW] Add scroll shadow at top/bottom when scrollable
      }}
      // TODO: [MEDIUM] Add onScroll={handleScroll}
      // TODO: [LOW] Add ARIA role and labels for accessibility
    >
      {messages.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          gap={2}
          sx={{ opacity: 0.6 }}
        >
          <Typography variant="h6" align="center">
            Hi! I'm your AI assistant
            {/* TODO: [LOW] Personalize with resume holder's name */}
            {/* TODO: [LOW] Add animated wave emoji or icon */}
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary">
            Ask me anything about this person's experience, skills, or projects!
            {/* TODO: [MEDIUM] Make this dynamic based on available resume data */}
          </Typography>
          <Box mt={2}>
            <Typography variant="caption" display="block" align="center">
              Try asking:
            </Typography>
            {/* TODO: [MEDIUM] Generate suggested questions dynamically from resume */}
            {/* TODO: [MEDIUM] Make these clickable - send question when clicked */}
            {/* TODO: [LOW] Randomize or rotate suggested questions */}
            <Typography variant="caption" display="block" align="center">
              • "What experience do you have with React?"
            </Typography>
            <Typography variant="caption" display="block" align="center">
              • "Tell me about your projects"
            </Typography>
            <Typography variant="caption" display="block" align="center">
              • "What are your technical skills?"
            </Typography>
            {/* TODO: [LOW] Add "View FAQ" button */}
          </Box>
        </Box>
      ) : (
        <>
          {/* TODO: [CRITICAL] Using index as key is bad practice! */}
          {/* ISSUES:
           * 1. Breaks React reconciliation when messages reorder
           * 2. Causes accessibility problems with screen readers
           * 3. Can cause state bugs if messages are edited/deleted
           * FIX: Add unique ID to ChatMessage type and use that as key
           */}
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
            /* TODO: [CRITICAL] Replace key={index} with key={message.id} */
            /* TODO: [LOW] Add message actions (copy, delete, regenerate) */
            /* TODO: [LOW] Add message feedback buttons (thumbs up/down) */
          ))}
          {/* TODO: [MEDIUM] Add better loading state with typing animation */}
          {isLoading && (
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Thinking...
                {/* TODO: [LOW] Add varied loading messages */}
                {/* TODO: [LOW] Show generation progress if available */}
              </Typography>
            </Box>
          )}
          <div ref={messagesEndRef} />
          {/* TODO: [LOW] Add invisible div for better scroll anchor */}
        </>
      )}
      {/* TODO: [MEDIUM] Add "New messages" indicator when user scrolled up */}
      {/* TODO: [LOW] Add "Scroll to bottom" FAB when not at bottom */}
    </Box>
  );
};

export default MessageList;

// TODO: [MEDIUM] Add empty state component for better modularity
// const EmptyState: FC = () => {...};

// TODO: [LOW] Add loading indicator component with animations
// const LoadingIndicator: FC = () => {...};

// TODO: [LOW] Add suggested questions component
// const SuggestedQuestions: FC<{ questions: string[], onClick: (q: string) => void }> = () => {...};
