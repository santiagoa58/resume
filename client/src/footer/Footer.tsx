import React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Title from '../section/SectionTitle';
import { useSelectedResume } from '../hooks/useResume';
import {
  getEmailHrefWithTemplate,
  getResumeEmail,
} from '../utils/resume_utils';
import Skeleton from '@mui/material/Skeleton';
import ContactButtonGroup from '../contact_buttons/ContactButtonGroup';

const Footer = () => {
  const selectedResume = useSelectedResume();
  const [email] = getResumeEmail(selectedResume);
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="100vh"
      alignContent="center"
      paddingY="3em"
      textAlign="center"
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap="5em"
        flex={1}
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
              {email && (
                <Link
                  variant="subtitle2"
                  href={getEmailHrefWithTemplate(
                    email,
                    selectedResume.name,
                    selectedResume.title
                  )}
                >
                  {email}
                </Link>
              )}
            </>
          ) : (
            <Skeleton height="2em" sx={{ width: '50%' }} />
          )}
        </Box>
        <ContactButtonGroup />
      </Box>
      <Box textAlign="center" display="flex" flexDirection="column">
        <Divider
          variant="middle"
          sx={{ marginTop: '2em', marginBottom: '2em' }}
        />
        <Typography variant="body2" color="inherit">
          Copyright &copy; {selectedResume?.name} {new Date().getFullYear()}.
          All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
