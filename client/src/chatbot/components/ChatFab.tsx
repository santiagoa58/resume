import React, { FC } from 'react';
import Fab from '@mui/material/Fab';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { ModelStatus } from '../utils/aiModel';

interface ChatFabProps {
  onClick: () => void;
  modelStatus: ModelStatus;
  // TODO: [LOW] Add unread message count prop
  // unreadCount?: number;
  // TODO: [LOW] Add custom icon prop
  // icon?: React.ReactNode;
  // TODO: [LOW] Add position customization
  // position?: { bottom?: number; right?: number; top?: number; left?: number };
}

/**
 * Floating Action Button for the chatbot
 *
 * TODO: [MEDIUM] Add notification badge for new messages (when minimized)
 * TODO: [MEDIUM] Add bounce/shake animation to draw attention on first visit
 * TODO: [LOW] Add sound effect on click (optional, user preference)
 * TODO: [LOW] Make position draggable (user can move it around)
 * TODO: [LOW] Add pulsing animation when AI has suggestion
 */
const ChatFab: FC<ChatFabProps> = ({ onClick, modelStatus }) => {
  const isReady = modelStatus === 'ready';
  const isLoading = modelStatus === 'loading';
  // TODO: [LOW] Add isError state styling
  const isError = modelStatus === 'error';

  // TODO: [LOW] Track first visit and show attention animation
  // const [isFirstVisit, setIsFirstVisit] = useState(() => {
  //   return !localStorage.getItem('chatbot_visited');
  // });

  const getTooltipText = () => {
    switch (modelStatus) {
      case 'loading':
        return 'AI is loading...';
        // TODO: [LOW] Show progress percentage in tooltip
      case 'error':
        return 'AI failed to load';
        // TODO: [MEDIUM] Add "Click to retry" to tooltip
      case 'ready':
        return 'Chat with AI Assistant';
        // TODO: [LOW] Add keyboard shortcut hint (Cmd+K)
      default:
        return 'AI Assistant';
    }
  };

  // TODO: [LOW] Add click handler that marks first visit
  const handleClick = () => {
    onClick();
    // if (isFirstVisit) {
    //   localStorage.setItem('chatbot_visited', 'true');
    //   setIsFirstVisit(false);
    // }
    // TODO: [LOW] Track FAB click for analytics
  };

  return (
    <Tooltip
      title={getTooltipText()}
      placement="left"
      // TODO: [LOW] Add arrow to tooltip
      // arrow
      // TODO: [LOW] Add enter delay for less intrusive UX
      // enterDelay={500}
    >
      <Fab
        color="primary"
        aria-label="chat with ai"
        onClick={handleClick}
        // TODO: [MEDIUM] Disable when error, change to "retry" behavior
        // disabled={isError}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          // TODO: [LOW] Make position responsive (move on mobile if needed)
          // TODO: [LOW] Add hover elevation effect
          // '&:hover': { transform: 'scale(1.05)' }
          // TODO: [LOW] Add transition for smooth animations
          // transition: 'all 0.3s ease'
          // TODO: [MEDIUM] Add attention animation on first visit
          // animation: isFirstVisit ? 'bounce 2s infinite' : 'none'
        }}
      >
        <Badge
          color="success"
          variant="dot"
          invisible={!isReady}
          // TODO: [MEDIUM] Show different badge for different states
          // - Red dot for error
          // - Orange dot for loading
          // - Number badge for unread messages
          // badgeContent={unreadCount}
          sx={{
            '& .MuiBadge-badge': {
              animation: isLoading ? 'pulse 2s infinite' : 'none',
              // TODO: [LOW] Add different animation for error state
              // backgroundColor: isError ? 'error.main' : 'success.main'
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
              // TODO: [LOW] Add shake animation for error state
              // animation: isError ? 'shake 0.5s' : ...
              '@keyframes spin': {
                '0%': {
                  transform: 'rotate(0deg)',
                },
                '100%': {
                  transform: 'rotate(360deg)',
                },
              },
              // TODO: [LOW] Add shake keyframes
              // '@keyframes shake': {
              //   '0%, 100%': { transform: 'translateX(0)' },
              //   '25%': { transform: 'translateX(-5px)' },
              //   '75%': { transform: 'translateX(5px)' }
              // }
            }}
          />
        </Badge>
      </Fab>
    </Tooltip>
  );
};

export default ChatFab;

// TODO: [LOW] Add first-visit attention animation component
// const FirstVisitAnimation: FC = () => (
//   <Box sx={{
//     position: 'absolute',
//     top: -10,
//     right: -10,
//     animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
//     '@keyframes ping': {
//       '75%, 100%': {
//         transform: 'scale(2)',
//         opacity: 0
//       }
//     }
//   }}>
//     <Circle />
//   </Box>
// );

// TODO: [MEDIUM] Add mini chat preview on hover
// Shows last message or quick actions without opening drawer
// const ChatPreview: FC = () => {
//   return (
//     <Paper sx={{ position: 'absolute', bottom: 80, right: 24, width: 300 }}>
//       <Typography>Last message preview...</Typography>
//       <Button>Open Chat</Button>
//     </Paper>
//   );
// };

// TODO: [LOW] Add drag-and-drop position customization
// const DraggableFab: FC = () => {
//   const [position, setPosition] = useState({ x: 24, y: 24 });
//   // Implement drag handlers
//   return <Fab style={{ bottom: position.y, right: position.x }} />;
// };

// TODO: [LOW] Add accessibility improvements
// - Better ARIA labels based on state
// - Keyboard navigation support (Tab to focus, Enter/Space to click)
// - Screen reader announcements for state changes

// TODO: [LOW] Add A/B testing variants
// - Different icons (chat bubble, robot, assistant)
// - Different positions (left vs right, top vs bottom)
// - Different colors
// - Different sizes
