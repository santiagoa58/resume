import React, { FC } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import SectionTitle from './SectionTitle';
import Skeleton from '@mui/material/Skeleton';

interface ISectionProps extends BoxProps {
  title: string;
  children?: React.ReactNode;
  loading?: boolean;
}

const SectionDivider: FC = () => (
  <Divider variant="middle" sx={{ marginTop: '2em', marginBottom: '2em' }} />
);

const SectionWrapper: FC<ISectionProps> = ({
  loading,
  title,
  sx,
  ...props
}) => {
  loading = loading || false;
  return (
    <Box sx={{ marginBottom: '10em', ...sx }} {...props}>
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

export default SectionWrapper;
