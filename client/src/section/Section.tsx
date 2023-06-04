import React, { FC } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import SectionTitle from './SectionTitle';
import Skeleton from '@mui/material/Skeleton';

interface ISectionProps {
  title: string;
  children?: React.ReactNode;
}
const Section: FC<ISectionProps> = (props) => {
  return (
    <Paper variant="elevation" elevation={0}>
      <SectionTitle loading={!props.children}>{props.title}</SectionTitle>
      <Divider variant="middle" />
      <Typography variant="body1">
        {props.children || <Skeleton variant="rectangular" height={150} />}
      </Typography>
    </Paper>
  );
};

export default Section;
