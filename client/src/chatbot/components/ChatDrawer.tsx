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
  // TODO: [LOW] Add optional width prop
  // TODO: [LOW] Add optional position prop ('left' | 'right')
  // TODO: [LOW] Add optional header customization
}

/**
 * Chat drawer component that slides in from the right
 *
 * TODO: [MEDIUM] Add drawer state persistence (remember if user closed it)
 * TODO: [MEDIUM] Add minimize/maximize functionality
 * TODO: [LOW] Add resizable width (drag handle on left edge)
 * TODO: [LOW] Add detach to separate window functionality
 * TODO: [LOW] Add fullscreen mode toggle
 */
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

  // TODO: [MEDIUM] Add confirmation dialog before clearing messages
  const handleClearMessages = () => {
    // TODO: [MEDIUM] Add "Are you sure?" confirmation
    // if (window.confirm('Clear conversation history?')) {
    clearMessages();
    // }
    // TODO: [LOW] Track clear action for analytics
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx={{
          width: { xs: '100%', sm: 400 },
          display: 'flex',
          flexDirection: 'column',
          // TODO: [LOW] Add transition animation
          // TODO: [LOW] Make width configurable
          // TODO: [LOW] Add max-height for mobile
        },
      }}
      // TODO: [MEDIUM] Add ModalProps for better accessibility
      // ModalProps={{
      //   keepMounted: true, // Better mobile performance
      // }}
      // TODO: [LOW] Add slide transition
      // transitionDuration={300}
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
          // TODO: [LOW] Add sticky position
          // TODO: [LOW] Add box shadow when scrolled
        }}
      >
        <Typography variant="h6">
          AI Assistant
          {/* TODO: [LOW] Add status indicator (online/offline) */}
          {/* TODO: [LOW] Add model info on click */}
        </Typography>
        <Box display="flex" gap={1}>
          {messages.length > 0 && (
            <IconButton
              size="small"
              onClick={handleClearMessages}
              title="Clear chat"
              // TODO: [LOW] Add confirmation dialog
              // TODO: [LOW] Add keyboard shortcut (Ctrl+Shift+Delete)
            >
              <DeleteIcon />
            </IconButton>
          )}
          {/* TODO: [LOW] Add more header actions */}
          {/* <IconButton size="small" title="Export chat"><DownloadIcon /></IconButton> */}
          {/* <IconButton size="small" title="Settings"><SettingsIcon /></IconButton> */}
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
            {/* TODO: [LOW] Add more detailed status message */}
            {/* TODO: [LOW] Add "What's happening?" explainer */}
          </Alert>
          <LinearProgress variant="determinate" value={modelProgress} />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            {modelProgress}% complete
            {/* TODO: [LOW] Add estimated time remaining */}
            {/* TODO: [LOW] Add download speed */}
            {/* TODO: [LOW] Add file being downloaded */}
          </Typography>
          {/* TODO: [LOW] Add cancel button */}
        </Box>
      )}

      {/* Model Error */}
      {modelStatus === 'error' && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">
            Failed to load AI model. Please refresh the page to try again.
            {/* TODO: [HIGH] Add retry button instead of requiring page refresh */}
            {/* TODO: [MEDIUM] Show specific error details in dev mode */}
            {/* TODO: [MEDIUM] Provide troubleshooting steps based on error type */}
          </Alert>
          {/* TODO: [HIGH] Add retry button */}
          {/* <Button onClick={retryModelLoad}>Retry</Button> */}
        </Box>
      )}

      {/* Chat Error */}
      {error && modelStatus === 'ready' && (
        <Box sx={{ p: 2 }}>
          <Alert
            severity="warning"
            onClose={() => {}}
            // TODO: [MEDIUM] Implement onClose or remove it (currently does nothing)
            // onClose={() => clearError()}
          >
            {error}
            {/* TODO: [MEDIUM] Add error-specific action buttons */}
            {/* TODO: [LOW] Add "Report issue" link */}
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
            // TODO: [LOW] Make placeholder dynamic based on context
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
            {/* TODO: [LOW] Add more engaging loading message */}
            {/* TODO: [LOW] Add loading animation or illustration */}
            {/* TODO: [LOW] Show "Why is this happening?" info */}
          </Typography>
        </Box>
      )}

      {/* TODO: [MEDIUM] Add footer with attribution */}
      {/* <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
        <Typography variant="caption">
          Powered by Transformers.js
        </Typography>
      </Box> */}
    </Drawer>
  );
};

export default ChatDrawer;

// TODO: [MEDIUM] Add settings panel component
// const SettingsPanel: FC = () => {
//   return (
//     <Box>
//       <Switch label="Auto-scroll" />
//       <Switch label="Sound effects" />
//       <Select label="Theme" options={['Auto', 'Light', 'Dark']} />
//     </Box>
//   );
// };

// TODO: [MEDIUM] Add export chat functionality
// const exportChat = (messages: ChatMessage[]) => {
//   const text = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');
//   const blob = new Blob([text], { type: 'text/plain' });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = `chat-${Date.now()}.txt`;
//   a.click();
// };

// TODO: [LOW] Add keyboard shortcuts info component
// const KeyboardShortcuts: FC = () => {
//   return (
//     <Dialog>
//       <Typography>Esc - Close chat</Typography>
//       <Typography>Ctrl+K - Open chat</Typography>
//       <Typography>Ctrl+Shift+Delete - Clear messages</Typography>
//     </Dialog>
//   );
// };
