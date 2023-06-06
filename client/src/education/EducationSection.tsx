import React, { FC } from 'react';
import SectionWrapper from '../section/SectionWrapper';
import SubSection from '../section/SubSection';
import { IResumeEducation } from '../types/api_types';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';

interface IEducationSectionProps {
  educations: IResumeEducation[] | undefined;
}

const EducationSection: FC<IEducationSectionProps> = (props) => {
  return (
    <SectionWrapper title="Education" loading={!props.educations}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2, sm: 2, md: 4 }}
      >
        {props.educations?.map((education) => (
          <SubSection
            title={education.institution}
            subtitle={education.duration}
            key={education.degree}
          >
            <Typography variant="body1" marginTop="0.5em">
              {education.degree}
            </Typography>
          </SubSection>
        ))}
      </Stack>
    </SectionWrapper>
  );
};

export default EducationSection;
