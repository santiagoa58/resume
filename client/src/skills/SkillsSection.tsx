import React, { FC } from 'react';
import SectionWrapper, {
  ISectionWrapperProps,
} from '../section/SectionWrapper';
import InvertedNestedThemeProvider from '../theme/InvertedNestedThemeProvider';
import SkillsTerminal from './SkillsTerminal';

interface ISkillsSectionProps extends Partial<ISectionWrapperProps> {
  skills: string[] | undefined;
}

const SkillsSection: FC<ISkillsSectionProps> = ({ skills, ...props }) => {
  return (
    <SectionWrapper title="Skills" loading={!skills} {...props}>
      <InvertedNestedThemeProvider>
        <SkillsTerminal skills={skills ?? []} />
      </InvertedNestedThemeProvider>
    </SectionWrapper>
  );
};

export default SkillsSection;
