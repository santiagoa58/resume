import React, { FC } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

interface ISectionProps {
  title: string;
  children?: React.ReactNode;
}
const Section: FC<ISectionProps> = (props) => {
  // wrap the section contents in a Paper component
  // add a title to the section
  // use Typography component for the title and the section contents
  return (
    <Paper>
      <Typography variant="h2">{props.title}</Typography>
      <Typography variant="body1">{props.children}</Typography>
    </Paper>
  );
};

export default Section;
