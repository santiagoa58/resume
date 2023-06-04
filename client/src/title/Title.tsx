import React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { formatTitle } from '../utils/formatters';
import Skeleton from '@mui/material/Skeleton';

export interface ITitleProps extends TypographyProps {
  loading?: boolean;
}

const Title: React.FC<ITitleProps> = ({ children, sx, loading, ...props }) => {
  const content =
    typeof children === 'string'
      ? formatTitle(children.toLowerCase())
      : children;
  const showSkeleton: boolean = !!loading || content === undefined;
  return (
    <Typography
      variant="h1"
      sx={{ textTransform: 'uppercase', ...sx }}
      {...props}
    >
      {showSkeleton ? <Skeleton /> : content}
    </Typography>
  );
};

export default Title;
