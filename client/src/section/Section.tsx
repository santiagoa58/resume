import React, { FC } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import SectionTitle from './SectionTitle';
import Skeleton from '@mui/material/Skeleton';

interface ISectionProps {
  title: string;
  children?: React.ReactNode;
}

const SectionDivider: FC = () => (
  <Divider variant="middle" sx={{ marginTop: '2em', marginBottom: '2em' }} />
);
const Section: FC<ISectionProps> = (props) => {
  return (
    <Box sx={{ height: '100vh' }}>
      <SectionTitle>{props.title}</SectionTitle>
      <SectionDivider />
      <Typography variant="body1">
        {props.children || <Skeleton variant="rectangular" height={150} />}
      </Typography>
    </Box>
  );
};

export default Section;
