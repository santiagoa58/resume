import React, { FC } from 'react';
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
import ErrorBoundaryFallback from '../utils/ErrorBoundaryFallback';

const Footer: FC<{ error?: string }> = (props) => {
  const selectedResume = useSelectedResume();
  const [email] = getResumeEmail(selectedResume);
  const titleProps = props.error ? { color: 'error.main' } : {};
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
        <Title {...titleProps}>Contact Me</Title>
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          width="100%"
        >
          <ErrorBoundaryFallback
            error={props.error}
            loading={selectedResume === undefined}
            loadingFallback={
              <Skeleton
                height="2em"
                sx={{ width: '50%' }}
                aria-label="loading"
              />
            }
          >
            <Typography variant="h6" color="inherit">
              {selectedResume?.name}
            </Typography>
            {email && (
              <Link
                variant="subtitle2"
                href={getEmailHrefWithTemplate(
                  email,
                  selectedResume?.name,
                  selectedResume?.title
                )}
              >
                {email}
              </Link>
            )}
          </ErrorBoundaryFallback>
        </Box>
        {!props.error && <ContactButtonGroup />}
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
