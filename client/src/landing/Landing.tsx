import React, { FC } from 'react';
import ResumeSelector from '../resume_selector/ResumeSelector';
import Title from '../title/Title';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowForward from '@mui/icons-material/ArrowForwardIos';
import ContactButtonGroup from '../contact_buttons/ContactButtonGroup';

interface ILandingProps {
  title: string | undefined;
}

const ActionButtons = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '200px', // Adjust as needed
      }}
    >
      <Button variant="outlined">Contact Me</Button>
      <Button variant="outlined" endIcon={<ArrowForward />}>
        Resume
      </Button>
    </Box>
  );
};
const Landing: FC<ILandingProps> = (props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '7em',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2em',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Title>{props?.title}</Title>
        <ResumeSelector sx={{ width: '50%' }} />
      </Box>
      <ActionButtons />
      <ContactButtonGroup />
    </Box>
  );
};

export default Landing;
