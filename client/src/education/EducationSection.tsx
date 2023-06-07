import React, { FC } from 'react';
import SectionWrapper, {
  ISectionWrapperProps,
} from '../section/SectionWrapper';
import SubSection from '../section/SubSection';
import { IResumeEducation } from '../types/api_types';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';

interface IEducationSectionProps
  extends Omit<Partial<ISectionWrapperProps>, 'loading'> {
  educations: IResumeEducation[] | undefined;
}

const EducationSection: FC<IEducationSectionProps> = ({
  educations,
  ...props
}) => {
  return (
    <SectionWrapper title="Education" loading={!educations} {...props}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2, sm: 2, md: 4 }}
      >
        {educations?.map((education) => (
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
