import React, { FC, useState, FormEvent } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  // TODO: [LOW] Add onTyping callback for typing indicators
  // TODO: [LOW] Add maxLength prop for input validation
  // TODO: [LOW] Add autoFocus prop
}

/**
 * Chat input component with send button
 *
 * TODO: [MEDIUM] Add input validation
 * - Max length (e.g., 500 characters)
 * - Min length (e.g., 1 character after trim)
 * - Character counter when approaching limit
 *
 * TODO: [MEDIUM] Add rate limiting
 * - Prevent rapid message sending
 * - Show cooldown timer if needed
 *
 * TODO: [LOW] Add multiline support with shift+enter
 * TODO: [LOW] Add autocomplete/suggestions based on common questions
 * TODO: [LOW] Add voice input button (Web Speech API)
 * TODO: [LOW] Add emoji picker
 */
const ChatInput: FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  placeholder = 'Ask me anything...',
}) => {
  const [input, setInput] = useState('');
  // TODO: [LOW] Track typing state for typing indicators
  // const [isTyping, setIsTyping] = useState(false);

  // TODO: [MEDIUM] Add max length validation
  const MAX_LENGTH = 500;
  // TODO: [LOW] Show character counter when > 80% of max

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      // TODO: [MEDIUM] Add client-side validation
      // - Check for profanity
      // - Check for spam patterns
      // - Check length limits

      onSend(input);
      setInput('');
      // TODO: [LOW] Focus back on input after sending
      // TODO: [LOW] Clear any validation errors
    }
  };

  // TODO: [MEDIUM] Add onChange handler with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // TODO: [MEDIUM] Enforce max length
    // if (newValue.length > MAX_LENGTH) return;

    setInput(newValue);

    // TODO: [LOW] Trigger typing indicator
    // if (onTyping) onTyping(newValue.length > 0);

    // TODO: [LOW] Track analytics (time to type, message length distribution)
  };

  // TODO: [LOW] Add keyboard shortcuts handler
  // const handleKeyDown = (e: React.KeyboardEvent) => {
  //   // Submit on Enter (without shift)
  //   if (e.key === 'Enter' && !e.shiftKey) {
  //     e.preventDefault();
  //     handleSubmit(e as any);
  //   }
  //   // TODO: Add Ctrl+K for command palette
  //   // TODO: Add up arrow to edit last message
  // };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        display: 'flex',
        gap: 1,
        // TODO: [LOW] Add box shadow for depth
      }}
    >
      <TextField
        fullWidth
        size="small"
        value={input}
        onChange={handleChange}
        // TODO: [LOW] Add onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        variant="outlined"
        autoComplete="off"
        // TODO: [MEDIUM] Add multiline support
        // multiline
        // maxRows={4}
        // TODO: [LOW] Add inputProps for max length
        // inputProps={{ maxLength: MAX_LENGTH }}
        // TODO: [LOW] Add error state for validation
        // error={hasError}
        // helperText={errorMessage}
        // TODO: [LOW] Add ARIA labels
        // aria-label="Chat message input"
      />
      {/* TODO: [LOW] Add character counter */}
      {/* {input.length > MAX_LENGTH * 0.8 && (
        <Typography variant="caption" color={input.length >= MAX_LENGTH ? 'error' : 'text.secondary'}>
          {input.length}/{MAX_LENGTH}
        </Typography>
      )} */}

      {/* TODO: [LOW] Add additional action buttons before send */}
      {/* <IconButton size="small" title="Add attachment"><AttachIcon /></IconButton> */}
      {/* <IconButton size="small" title="Voice input"><MicIcon /></IconButton> */}
      {/* <IconButton size="small" title="Emoji"><EmojiIcon /></IconButton> */}

      <IconButton
        type="submit"
        color="primary"
        disabled={disabled || !input.trim()}
        // TODO: [LOW] Add loading state when sending
        // TODO: [LOW] Add success animation on send
        // TODO: [LOW] Add ARIA label
        aria-label="Send message"
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default ChatInput;

// TODO: [MEDIUM] Add voice input component
// const VoiceInput: FC<{ onResult: (text: string) => void }> = () => {
//   // Use Web Speech API
//   const recognition = new (window as any).webkitSpeechRecognition();
//   // ...
// };

// TODO: [LOW] Add emoji picker component
// import EmojiPicker from 'emoji-picker-react';

// TODO: [LOW] Add autocomplete/suggestions component
// const Suggestions: FC<{ suggestions: string[], onSelect: (text: string) => void }> = () => {...};

// TODO: [MEDIUM] Add input validation utilities
// const validateInput = (text: string): { valid: boolean, error?: string } => {
//   if (text.length === 0) return { valid: false, error: 'Message cannot be empty' };
//   if (text.length > 500) return { valid: false, error: 'Message too long' };
//   if (containsProfanity(text)) return { valid: false, error: 'Please keep it professional' };
//   return { valid: true };
// };
