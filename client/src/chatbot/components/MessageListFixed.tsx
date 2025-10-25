import React, { FC, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import ChatMessage from './ChatMessageFixed';
import { ChatMessage as ChatMessageType } from '../utils/generation';

interface MessageListProps {
  messages: ChatMessageType[];
  isLoading: boolean;
}

const MessageListFixed: FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
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
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary">
            Ask me anything about this person's experience, skills, or projects!
          </Typography>
          <Box mt={2}>
            <Typography variant="caption" display="block" align="center">
              Try asking:
            </Typography>
            <Typography variant="caption" display="block" align="center">
              • "What experience do you have with React?"
            </Typography>
            <Typography variant="caption" display="block" align="center">
              • "Tell me about your projects"
            </Typography>
            <Typography variant="caption" display="block" align="center">
              • "What are your technical skills?"
            </Typography>
          </Box>
        </Box>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Thinking...
              </Typography>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </Box>
  );
};

export default MessageListFixed;
