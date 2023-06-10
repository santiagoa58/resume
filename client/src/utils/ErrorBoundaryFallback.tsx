import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface IErrorBoundaryFallbackProps {
  error?: string;
  loading?: boolean;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  children?: React.ReactNode;
}

interface IDefaultErrorFallbackProps {
  error: string;
}

const DefaultErrorFallback: FC<IDefaultErrorFallbackProps> = (props) => {
  return (
    <Box color="error.main" textAlign="center">
      <Typography variant="h5" component="h3" mb="1em">
        {props.error}
      </Typography>
      <Typography component="p">
        Please refresh the page or try again later.
      </Typography>
    </Box>
  );
};

const ErrorBoundaryFallback: FC<IErrorBoundaryFallbackProps> = (props) => {
  if (!!props.error) {
    return (
      <>{props.errorFallback ?? <DefaultErrorFallback error={props.error} />}</>
    );
  }
  if (props.loading && !!props.loadingFallback) {
    return <>{props.loadingFallback}</>;
  }
  return <>{props.children}</>;
};

// a better name for this component would be ErrorBoundaryFallback
export default ErrorBoundaryFallback;
