import React, { FC } from 'react';
import Typography from '@mui/material/Typography';
import SectionWrapper from './SectionWrapper';

interface ISectionProps {
  title: string;
  children?: React.ReactNode;
}

const Section: FC<ISectionProps> = (props) => {
  return (
    <SectionWrapper title={props.title} loading={!props.children}>
      <Typography variant="body1">{props.children}</Typography>
    </SectionWrapper>
  );
};

export default Section;
