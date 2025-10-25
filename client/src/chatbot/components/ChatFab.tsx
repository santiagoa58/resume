import React, { FC } from 'react';
import Fab from '@mui/material/Fab';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { ModelStatus } from '../utils/aiModel';

interface ChatFabProps {
  onClick: () => void;
  modelStatus: ModelStatus;
}

const ChatFab: FC<ChatFabProps> = ({ onClick, modelStatus }) => {
  const isReady = modelStatus === 'ready';
  const isLoading = modelStatus === 'loading';

  const getTooltipText = () => {
    switch (modelStatus) {
      case 'loading':
        return 'AI is loading...';
      case 'error':
        return 'AI failed to load';
      case 'ready':
        return 'Chat with AI Assistant';
      default:
        return 'AI Assistant';
    }
  };

  return (
    <Tooltip title={getTooltipText()} placement="left">
      <Fab
        color="primary"
        aria-label="chat with ai"
        onClick={onClick}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Badge
          color="success"
          variant="dot"
          invisible={!isReady}
          sx={{
            '& .MuiBadge-badge': {
              animation: isLoading ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%': {
                  opacity: 1,
                },
                '50%': {
                  opacity: 0.3,
                },
                '100%': {
                  opacity: 1,
                },
              },
            },
          }}
        >
          <SmartToyIcon
            sx={{
              animation: isLoading ? 'spin 2s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': {
                  transform: 'rotate(0deg)',
                },
                '100%': {
                  transform: 'rotate(360deg)',
                },
              },
            }}
          />
        </Badge>
      </Fab>
    </Tooltip>
  );
};

export default ChatFab;
