import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import SectionTitle from './SectionTitle';
import Skeleton from '@mui/material/Skeleton';

interface ISectionProps {
  title: string;
  children?: React.ReactNode;
  loading?: boolean;
}

const SectionDivider: FC = () => (
  <Divider variant="middle" sx={{ marginTop: '2em', marginBottom: '2em' }} />
);

const SectionWrapper: FC<ISectionProps> = (props) => {
  const loading = props.loading || false;
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <SectionTitle>{props.title}</SectionTitle>
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
