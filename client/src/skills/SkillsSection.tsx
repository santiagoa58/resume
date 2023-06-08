import React, { FC } from 'react';
import Paper from '@mui/material/Paper';
import SectionWrapper from '../section/SectionWrapper';

interface ISkillsSectionProps {
  skills: string[] | undefined;
}

const SkillsSection: FC<ISkillsSectionProps> = ({ skills, ...props }) => {
  return (
    <SectionWrapper title="Work Experience" loading={!skills} {...props}>
      <Paper elevation={0}></Paper>
    </SectionWrapper>
  );
};

export default SkillsSection;
