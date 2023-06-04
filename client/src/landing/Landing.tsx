import React, { FC } from 'react';
import ResumeSelector from '../resume_selector/ResumeSelector';
import Title from '../title/Title';
import Box from '@mui/material/Box';

interface ILandingProps {
  title: string | undefined;
}
const Landing: FC<ILandingProps> = (props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 4,
      }}
    >
      <Title>{props?.title}</Title>
      <ResumeSelector />
    </Box>
  );
};

export default Landing;
