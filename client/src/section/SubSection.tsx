import React, { FC } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface ISubSectionProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

interface ISubSectionTitleProps {
  subtitle?: string;
  children?: React.ReactNode;
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
        sx={(theme) => ({
          marginRight: '1em',
          whiteSpace: 'nowrap',
          [theme.breakpoints.down('sm')]: {
            display: 'block',
            whiteSpace: 'normal',
          },
        })}
      >
        {props.children}
      </Box>
      {props.subtitle && (
        <Typography variant="subtitle1" component="span" whiteSpace="nowrap">
          {props.subtitle}
        </Typography>
      )}
    </Typography>
  );
};

const SubSection: FC<ISubSectionProps> = (props) => {
  return (
    <Box>
      <SubSectionTitle subtitle={props.subtitle}>{props.title}</SubSectionTitle>
      {props.children}
    </Box>
  );
};

export default SubSection;
