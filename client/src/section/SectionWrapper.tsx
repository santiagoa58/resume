import React, { FC, ForwardRefRenderFunction } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import SectionTitle from './SectionTitle';
import Skeleton from '@mui/material/Skeleton';
import ErrorBoundaryFallback from '../utils/ErrorBoundaryFallback';

export interface ISectionWrapperProps extends Omit<BoxProps, 'ref'> {
  title: string;
  children?: React.ReactNode;
  loading?: boolean;
  error?: string;
}

const SectionDivider: FC = () => (
  <Divider variant="middle" sx={{ marginTop: '2em', marginBottom: '2em' }} />
);

const SectionWrapper: ForwardRefRenderFunction<
  HTMLDivElement,
  ISectionWrapperProps
> = ({ loading, title, error, sx, ...props }, ref) => {
  loading = loading || false;
  const titleProps = error ? { color: 'error.main' } : {};
  return (
    <Box sx={{ marginBottom: '10em', ...sx }} {...props} ref={ref}>
      <SectionTitle {...titleProps}>{title}</SectionTitle>
      <SectionDivider />
      <ErrorBoundaryFallback
        loading={loading}
        error={error}
        loadingFallback={<Skeleton variant="rectangular" height={150} />}
      >
        {props.children}
      </ErrorBoundaryFallback>
    </Box>
  );
};

export default React.forwardRef(SectionWrapper);
