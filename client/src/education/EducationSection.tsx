import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { FC } from 'react';
import SectionWrapper, {
  ISectionWrapperProps,
} from '../section/SectionWrapper';
import SubSection from '../section/SubSection';
import { IResumeEducation } from '../types/api_types';

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
      <Grid container spacing={{ xs: 3 }}>
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
      </Grid>
    </SectionWrapper>
  );
};

export default EducationSection;
