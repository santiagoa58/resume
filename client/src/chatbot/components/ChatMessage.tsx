import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ChatMessage as ChatMessageType } from '../utils/aiModel';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

interface ChatMessageProps {
  message: ChatMessageType;
  // TODO: [LOW] Add optional onCopy, onDelete, onRegenerate handlers
  // TODO: [LOW] Add optional showActions prop
  // TODO: [LOW] Add optional showTimestamp prop
}

/**
 * Individual chat message bubble component
 *
 * TODO: [MEDIUM] Add markdown rendering support (links, bold, code blocks)
 * Users might want to format responses or AI might generate formatted text
 *
 * TODO: [MEDIUM] Add code syntax highlighting for technical content
 * Resume site might discuss code - would be nice to highlight it
 *
 * TODO: [LOW] Add message actions (copy, delete, regenerate AI response)
 * TODO: [LOW] Add timestamp display
 * TODO: [LOW] Add "..." animation for messages being generated (streaming)
 * TODO: [LOW] Add link preview for URLs in messages
 */
const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // TODO: [LOW] Add message state (sending, sent, failed, edited)
  // TODO: [LOW] Add error indicator for failed messages
  // TODO: [LOW] Add edit mode for user messages

  return (
    <Box
      display="flex"
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      mb={2}
      gap={1}
      // TODO: [LOW] Add fade-in animation for new messages
      // TODO: [LOW] Add ARIA labels for accessibility
    >
      {!isUser && (
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          // TODO: [LOW] Add custom avatar image option
          // TODO: [LOW] Add tooltip with AI model info on hover
        >
          <SmartToyIcon sx={{ color: 'primary.contrastText', fontSize: 20 }} />
        </Box>
      )}
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          maxWidth: '70%',
          bgcolor: isUser ? 'primary.main' : 'background.paper',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          // TODO: [LOW] Add subtle border for better definition
          // TODO: [LOW] Add box-shadow on hover
          // TODO: [LOW] Make maxWidth responsive (80% on mobile)
        }}
        // TODO: [LOW] Add onClick handler for message selection
        // TODO: [LOW] Add onDoubleClick for quick copy
      >
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
          {message.content}
          {/* TODO: [MEDIUM] Replace with markdown renderer */}
          {/* TODO: [MEDIUM] Add link detection and auto-linking */}
          {/* TODO: [LOW] Add text selection handling */}
        </Typography>
        {/* TODO: [LOW] Add timestamp below content */}
        {/* TODO: [LOW] Add action buttons (copy, feedback, etc.) */}
        {/* TODO: [LOW] Add "Regenerate" button for AI messages */}
      </Paper>
      {isUser && (
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: 'secondary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          // TODO: [LOW] Use actual user avatar if available
          // TODO: [LOW] Add tooltip with "You" label
        >
          <PersonIcon sx={{ color: 'secondary.contrastText', fontSize: 20 }} />
        </Box>
      )}
    </Box>
  );
};

export default ChatMessage;

// TODO: [MEDIUM] Add separate components for different message types
// const UserMessage: FC = () => {...};
// const AssistantMessage: FC = () => {...};
// const SystemMessage: FC = () => {...};  // For announcements, errors, etc.

// TODO: [MEDIUM] Add message actions component
// const MessageActions: FC<{ message: ChatMessageType }> = () => {
//   return (
//     <Box>
//       <IconButton size="small" title="Copy"><CopyIcon /></IconButton>
//       <IconButton size="small" title="Regenerate"><RefreshIcon /></IconButton>
//     </Box>
//   );
// };

// TODO: [LOW] Add markdown renderer wrapper
// import ReactMarkdown from 'react-markdown';
// const MarkdownContent: FC<{ content: string }> = ({ content }) => (
//   <ReactMarkdown components={customComponents}>{content}</ReactMarkdown>
// );

// TODO: [LOW] Add code block component with syntax highlighting
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
