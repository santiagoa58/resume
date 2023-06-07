import React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

export type ITitleProps<D extends React.ElementType<any> = 'span'> =
  TypographyProps<D>;

const Title = <D extends React.ElementType<any>>({
  children,
  sx,
  ...props
}: ITitleProps<D>) => {
  const showSkeleton: boolean = children === undefined;
  return (
    <Typography
      variant="h1"
      color="secondary"
      sx={{ textTransform: 'uppercase', ...sx }}
      {...props}
    >
      {showSkeleton ? (
        <Skeleton sx={{ display: 'inline-block' }} width="5em" />
      ) : (
        <>&lt;{children}/&gt;</>
      )}
    </Typography>
  );
};

export default Title;
