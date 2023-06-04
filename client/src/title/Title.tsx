import React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

export interface ITitleProps extends TypographyProps {}

const Title: React.FC<ITitleProps> = ({ children, sx, ...props }) => {
  const showSkeleton: boolean = children === undefined;
  return (
    <Typography
      variant="h1"
      sx={{ textTransform: 'uppercase', ...sx }}
      {...props}
    >
      {showSkeleton ? (
        <Skeleton sx={{ display: 'inline-block' }} width="5em" />
      ) : (
        <>&lt; {children} /&gt;</>
      )}
    </Typography>
  );
};

export default Title;
