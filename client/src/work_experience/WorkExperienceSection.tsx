import React, { FC } from 'react';
import SectionWrapper from '../section/SectionWrapper';
import SubSection from '../section/SubSection';
import { IResumeExperience } from '../types/api_types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TabMenu from './WorkExperienceTabMenu';

interface IWorkExperienceSectionProps {
  experiences: IResumeExperience[] | undefined;
}

const getCompanyInfoSubtitle = (experience: IResumeExperience) =>
  `${experience.company} | ${experience.location}`;

const WorkExperienceSection: FC<IWorkExperienceSectionProps> = (props) => {
  return (
    <SectionWrapper title="Work Experience" loading={!props.experiences}>
      <TabMenu workExperiences={props.experiences}>
        {(experience) => (
          <SubSection
            title={experience?.role ?? ''}
            subtitle={experience?.duration}
          >
            <Box>
              <Typography
                variant="subtitle1"
                marginTop="0.5em"
                marginBottom="2em"
                textTransform="uppercase"
              >
                {getCompanyInfoSubtitle(experience)}
              </Typography>
              {experience?.responsibilities.map((responsibility, index) => (
                <Typography variant="body1" marginTop="1em" key={index}>
                  {responsibility}
                </Typography>
              ))}
            </Box>
          </SubSection>
        )}
      </TabMenu>
    </SectionWrapper>
  );
};

export default WorkExperienceSection;
