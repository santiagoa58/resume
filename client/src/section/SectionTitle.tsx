import React, { FC } from 'react';
import Title, { ITitleProps } from '../title/Title';

export interface ISectionTitleProps extends ITitleProps {}

const SectionTitle: FC<ISectionTitleProps> = (props) => {
  const { sx } = props;
  return (
    <Title
      variant="h2"
      sx={{ textTransform: 'capitalize', ...sx }}
      {...props}
    />
  );
};

export default SectionTitle;
