import React, { Component, ErrorInfo, ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ChatbotErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1300,
            maxWidth: 400,
          }}
        >
          <Paper elevation={8} sx={{ p: 3 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Chatbot Error
              </Typography>
              <Typography variant="body2" gutterBottom>
                The AI chatbot encountered an error and needs to be reset.
              </Typography>
              {this.state.error && (
                <Typography
                  variant="caption"
                  component="div"
                  sx={{
                    mt: 1,
                    p: 1,
                    bgcolor: 'rgba(0,0,0,0.1)',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                  }}
                >
                  {this.state.error.message}
                </Typography>
              )}
            </Alert>
            <Box display="flex" gap={1} justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleReset}
              >
                Reset Chatbot
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ChatbotErrorBoundary;
