import React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Title from '../section/SectionTitle';
import { useSelectedResume } from '../hooks/useResume';
import { getResumeEmail } from '../utils/resume_utils';
import Skeleton from '@mui/material/Skeleton';

const Footer = () => {
  const selectedResume = useSelectedResume();
  const [email] = getResumeEmail(selectedResume);
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      gap="7em"
    >
      <Title>Contact Me</Title>
      <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        width="100%"
      >
        {selectedResume ? (
          <>
            <Typography variant="h6" color="inherit">
              {selectedResume.name}
            </Typography>
            <Typography variant="subtitle2" color="inherit">
              {email}
            </Typography>
          </>
        ) : (
          <Skeleton height="2em" sx={{ width: '50%' }} />
        )}
      </Box>
      <Box>
        <Divider
          variant="middle"
          sx={{ marginTop: '2em', marginBottom: '2em' }}
        />
        <Typography variant="body2" color="inherit">
          &copy; {new Date().getFullYear()} {selectedResume?.name}. All Rights
          Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
