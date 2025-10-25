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
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { UseChatbotReturn } from '../hooks/useChatbot';

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
  chatbot: UseChatbotReturn;
}

const ChatDrawer: FC<ChatDrawerProps> = ({ open, onClose, chatbot }) => {
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
      {/* Header */}
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
            <IconButton size="small" onClick={clearMessages} title="Clear chat">
              <DeleteIcon />
            </IconButton>
          )}
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Model Loading Progress */}
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

      {/* Model Error */}
      {modelStatus === 'error' && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">
            Failed to load AI model. Please refresh the page to try again.
          </Alert>
        </Box>
      )}

      {/* Chat Error */}
      {error && modelStatus === 'ready' && (
        <Box sx={{ p: 2 }}>
          <Alert severity="warning" onClose={() => {}}>
            {error}
          </Alert>
        </Box>
      )}

      {/* Messages */}
      {isModelReady && (
        <>
          <MessageList messages={messages} isLoading={isLoading} />
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

      {/* Model Loading Placeholder */}
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

export default ChatDrawer;
