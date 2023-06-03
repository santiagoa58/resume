import React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';

const Title: React.FC<TypographyProps> = (props) => {
  return (
    <Typography variant="h1" {...props}>
      {props.children}
    </Typography>
  );
};

export default Title;
