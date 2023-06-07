import React, { ForwardRefRenderFunction } from 'react';
import Typography from '@mui/material/Typography';
import SectionWrapper, { ISectionWrapperProps } from './SectionWrapper';

interface ISectionProps extends Omit<ISectionWrapperProps, 'loading'> {
  title: string;
  children?: React.ReactNode;
}

const Section: ForwardRefRenderFunction<HTMLDivElement, ISectionProps> = (
  { children, title, ...props },
  ref
) => {
  return (
    <SectionWrapper title={title} loading={!children} {...props} ref={ref}>
      <Typography variant="body1">{children}</Typography>
    </SectionWrapper>
  );
};

export default React.forwardRef(Section);
