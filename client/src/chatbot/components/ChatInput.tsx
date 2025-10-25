import React, { FC, useState, FormEvent } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  placeholder = 'Ask me anything...',
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

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
      }}
    >
      <TextField
        fullWidth
        size="small"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        variant="outlined"
        autoComplete="off"
      />
      <IconButton
        type="submit"
        color="primary"
        disabled={disabled || !input.trim()}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default ChatInput;
