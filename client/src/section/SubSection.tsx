import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React, { FC } from 'react';

interface ISubSectionTitleProps {
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}

interface ISubSectionProps extends ISubSectionTitleProps {
  title: string;
}

const SubSectionTitle: FC<ISubSectionTitleProps> = (props) => {
  return (
    <Typography
      variant="h6"
      component="h3"
      textTransform="uppercase"
      sx={{ wordBreak: 'break-word' }}
      fontWeight={600}
    >
      <Box
        component="span"
        sx={() => ({
          marginRight: '1em',
          display: 'block',
        })}
      >
        {props.children}
      </Box>
      {props.subtitle && (
        <Typography variant="subtitle1" component="span">
          {props.subtitle}
        </Typography>
      )}
    </Typography>
  );
};

const SubSection: FC<ISubSectionProps> = (props) => {
  return (
    <Grid item xs={12} md={4}>
      <SubSectionTitle subtitle={props.subtitle}>{props.title}</SubSectionTitle>
      {props.children}
    </Grid>
  );
};

export default SubSection;
