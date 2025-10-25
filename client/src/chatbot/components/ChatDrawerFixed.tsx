import React, { FC } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import MessageListFixed from './MessageListFixed';
import ChatInput from './ChatInput';
import { UseChatbotReturn } from '../hooks/useChatbotFixed';

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
  chatbot: UseChatbotReturn;
}

const ChatDrawerFixed: FC<ChatDrawerProps> = ({ open, onClose, chatbot }) => {
  const {
    messages,
    sendMessage,
    isLoading,
    modelStatus,
    modelProgress,
    error,
    clearMessages,
  } = chatbot;

  const isModelReady = modelStatus === 'ready';

  const handleClearMessages = () => {
    if (messages.length > 0 && window.confirm('Clear conversation history?')) {
      clearMessages();
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6">AI Assistant</Typography>
        <Box display="flex" gap={1}>
          {messages.length > 0 && (
            <IconButton
              size="small"
              onClick={handleClearMessages}
              title="Clear chat"
            >
              <DeleteIcon />
            </IconButton>
          )}
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {modelStatus === 'loading' && (
        <Box sx={{ p: 2 }}>
          <Alert severity="info" sx={{ mb: 1 }}>
            Loading AI model... This may take a minute on first load.
          </Alert>
          <LinearProgress variant="determinate" value={modelProgress} />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            {modelProgress}% complete
          </Typography>
        </Box>
      )}

      {modelStatus === 'error' && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">
            Failed to load AI model. Please refresh the page to try again.
          </Alert>
        </Box>
      )}

      {error && modelStatus === 'ready' && (
        <Box sx={{ p: 2 }}>
          <Alert severity="warning">{error}</Alert>
        </Box>
      )}

      {isModelReady && (
        <>
          <MessageListFixed messages={messages} isLoading={isLoading} />
          <Divider />
          <ChatInput
            onSend={sendMessage}
            disabled={!isModelReady || isLoading}
            placeholder={
              isLoading
                ? 'AI is thinking...'
                : 'Ask me about experience, skills, projects...'
            }
          />
        </>
      )}

      {modelStatus === 'loading' && (
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            Please wait while the AI model is being prepared...
            <br />
            This is a one-time download.
          </Typography>
        </Box>
      )}
    </Drawer>
  );
};

export default ChatDrawerFixed;
