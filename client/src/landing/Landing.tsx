import React, { FC, ForwardRefRenderFunction } from 'react';
import ResumeSelector from '../resume_selector/ResumeSelector';
import Title from '../title/Title';
import Box, { BoxProps } from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import ContactButtonGroup from '../contact_buttons/ContactButtonGroup';
import Link from '@mui/material/Link';
import Skeleton from '@mui/material/Skeleton';
import { useSelectedResume } from '../hooks/useResume';
import { getResumeEmail } from '../utils/resume_utils';
import ErrorBoundaryFallback from '../utils/ErrorBoundaryFallback';

interface IActionButtonProps extends ButtonProps {
  // text to display on button
  children: string;
  onClick: () => void;
}

interface ILandingProps extends BoxProps {
  title: string | undefined;
  actionButtonProps: IActionButtonProps;
  error?: string;
}

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
const ActionButtons: FC<IActionButtonProps> = (actionButtonProps) => {
  const selectedResume = useSelectedResume();
  const [email] = getResumeEmail(selectedResume);
  return (
    <Box display="flex" justifyContent="center" gap="2em" width="100%">
      {selectedResume === undefined ? (
        <Skeleton height="2em" sx={{ width: '30%' }} />
      ) : (
        <>
          {email && (
            <>
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
              <Button variant="outlined" {...actionButtonProps} />
            </>
          )}
        </>
      )}
    </Box>
  );
};
const Landing: ForwardRefRenderFunction<HTMLDivElement, ILandingProps> = (
  { title, actionButtonProps, error, ...props },
  ref
) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      gap="7em"
      {...props}
      ref={ref}
    >
      <Box
        textAlign="center"
        display="flex"
        gap="2em"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <ErrorBoundaryFallback
          error={error}
          errorFallback={<Title color="error.main">ERROR</Title>}
        >
          <Title>{title}</Title>
        </ErrorBoundaryFallback>
        <ResumeSelector sx={{ width: '75%' }} />
      </Box>
      <ErrorBoundaryFallback error={error}>
        <Box display="flex" gap="2em" width="100%" flexDirection="column">
          <ActionButtons {...actionButtonProps} />
          <ContactButtonGroup />
        </Box>
      </ErrorBoundaryFallback>
    </Box>
  );
};

export default React.forwardRef(Landing);
