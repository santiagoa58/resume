import React, { FC } from 'react';
import ResumeSelector from '../resume_selector/ResumeSelector';
import Title from '../title/Title';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ContactButtonGroup from '../contact_buttons/ContactButtonGroup';
import Link from '@mui/material/Link';
import Skeleton from '@mui/material/Skeleton';
import { useSelectedResume } from '../hooks/useResume';
import { IResume } from '../types/api_types';

interface ILandingProps {
  title: string | undefined;
}

const getEmailFromResume = (
  resume: IResume | undefined
): string | undefined => {
  return resume?.contacts?.[0] ?? undefined;
};

const getEmailHrefWithTemplate = (
  email: string,
  name?: string,
  job_title?: string
) => {
  const firstName = name?.split(' ')[0];
  let title = job_title?.toLowerCase() ?? 'software engineer';
  //capitalize every first letter of title
  title = title.replace(/\b(\w)/g, (s) => s.toUpperCase());
  const subject = encodeURIComponent(
    `Interest in Your ${title ?? 'Software Engineer'} Profile`
  );
  const body = encodeURIComponent(
    `Hello ${
      firstName ?? 'there'
    },\n\nI came across your profile and am interested in your skills and experience. Would you be available for a discussion regarding potential opportunities at our company?\n\nKind regards,\n[Your Name]`
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
};

// link buttons to email
const ActionButtons: FC = () => {
  const selectedResume = useSelectedResume();
  const email = getEmailFromResume(selectedResume);
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2em',
        width: '100%',
      }}
    >
      {selectedResume === undefined ? (
        <Skeleton height="2em" sx={{ width: '50%' }} />
      ) : (
        <>
          {email && (
            <Link
              href={getEmailHrefWithTemplate(
                email,
                selectedResume?.name,
                selectedResume?.title
              )}
              underline="none"
            >
              <Button variant="contained">Email Me</Button>
            </Link>
          )}
          {/* TODO: Download Resume Button */}
        </>
      )}
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
        <ResumeSelector sx={{ width: '75%' }} />
      </Box>
      <ActionButtons />
      <ContactButtonGroup />
    </Box>
  );
};

export default Landing;
