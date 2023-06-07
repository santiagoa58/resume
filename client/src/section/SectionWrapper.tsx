import React, { FC, ForwardRefRenderFunction } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import SectionTitle from './SectionTitle';
import Skeleton from '@mui/material/Skeleton';

export interface ISectionWrapperProps extends Omit<BoxProps, 'ref'> {
  title: string;
  children?: React.ReactNode;
  loading?: boolean;
}

const SectionDivider: FC = () => (
  <Divider variant="middle" sx={{ marginTop: '2em', marginBottom: '2em' }} />
);

const SectionWrapper: ForwardRefRenderFunction<
  HTMLDivElement,
  ISectionWrapperProps
> = ({ loading, title, sx, ...props }, ref) => {
  loading = loading || false;
  return (
    <Box sx={{ marginBottom: '10em', ...sx }} {...props} ref={ref}>
      <SectionTitle>{title}</SectionTitle>
      <SectionDivider />
      {loading ? (
        <Skeleton variant="rectangular" height={150} />
      ) : (
        props.children
      )}
    </Box>
  );
};

export default React.forwardRef(SectionWrapper);
