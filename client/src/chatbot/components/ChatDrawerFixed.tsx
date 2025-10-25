import React, { FC, useRef } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
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
    retryModelInit,
    exportConversation,
    importConversation,
  } = chatbot;

  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isModelReady = modelStatus === 'ready';

  const handleClearMessages = () => {
    if (messages.length > 0 && window.confirm('Clear conversation history?')) {
      clearMessages();
    }
    setMenuAnchor(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleExport = () => {
    const data = exportConversation();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chatbot-conversation-${
      new Date().toISOString().split('T')[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setMenuAnchor(null);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
    setMenuAnchor(null);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const success = importConversation(content);
        if (success) {
          alert('Conversation imported successfully!');
        }
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
              onClick={handleMenuOpen}
              title="More options"
            >
              <MoreVertIcon />
            </IconButton>
          )}
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleExport} disabled={messages.length === 0}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export conversation</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleImportClick}>
          <ListItemIcon>
            <UploadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Import conversation</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleClearMessages}
          disabled={messages.length === 0}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Clear conversation</ListItemText>
        </MenuItem>
      </Menu>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleImport}
      />

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
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={retryModelInit}
              >
                Retry
              </Button>
            }
          >
            Failed to load AI model. Click Retry to try again.
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
