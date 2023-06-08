import React, { FC, createRef } from 'react';
import Landing from './landing/Landing';
import Section from './section/Section';
import { useGetSelectedResume } from './hooks/useResume';
import EducationSection from './education/EducationSection';
import WorkExperienceSection from './work_experience/WorkExperienceSection';
import ScrollTop, { scrollToElement } from './scroll_top/ScrollTop';
import MainLoading from './main_loading/MainLoading';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import SkillsSection from './skills/SkillsSection';

const MainResumeContent: FC = () => {
  const selectedResume = useGetSelectedResume();
  const landingRef = createRef<HTMLDivElement>();
  const aboutMeRef = createRef<HTMLDivElement>();
  return (
    <MainLoading>
      <Landing
        title={selectedResume?.name}
        id="landing"
        ref={landingRef}
        actionButtonProps={{
          children: 'Learn More',
          onClick: () => scrollToElement(aboutMeRef),
          endIcon: <ArrowForwardIcon />,
        }}
      />
      <Section title="About Me" id="about-me" ref={aboutMeRef}>
        {selectedResume?.summary}
      </Section>
      <SkillsSection skills={selectedResume?.skills} id="skills" />
      <WorkExperienceSection
        experiences={selectedResume?.experiences}
        id="work-experience"
      />
      <EducationSection
        educations={selectedResume?.educations}
        id="education-section"
      />
      <ScrollTop anchorRef={landingRef} />
    </MainLoading>
  );
};

export default MainResumeContent;
