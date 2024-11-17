import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import React, { FC, useRef } from 'react';
import EducationSection from './education/EducationSection';
import Footer from './footer/Footer';
import { useGetSelectedResume } from './hooks/useResume';
import Landing from './landing/Landing';
import MainLoading from './main_loading/MainLoading';
import Projects from './projects/Projects';
import ScrollTop, { scrollToElement } from './scroll_top/ScrollTop';
import Section from './section/Section';
import SkillsSection from './skills/SkillsSection';
import ThemeToggleFab from './theme/ThemeToggleFab';
import { ResumeRole } from './types/resume';
import WorkExperienceSection from './work_experience/WorkExperienceSection';

const ROLE_PATTERNS: { [key in ResumeRole]: RegExp } = {
  frontend: /\b(frontend|front end|client|ui|user interface)\b/i,
  backend: /\b(backend|back end|server|api|database)\b/i,
  fullstack: /\b(fullstack|full stack)\b/i,
  devops: /\b(devops|infrastructure|operations|cloud|site reliability|sre)\b/i,
  qa: /\b(qa|quality assurance|tester|testing|validation)\b/i,
  pm: /\b(product manager|project manager|program manager|scrum master|agile coach)\b/i,
  designer: /\b(designer|design|ux|user experience|visual|graphic)\b/i,
  'machine-learning':
    /\b(machine learning|ml|artificial intelligence|ai|deep learning)\b/i,
  'data-scientist':
    /\b(data scientist|data science|data analyst|big data|analytics)\b/i,
  security:
    /\b(security|cybersecurity|information security|infosec|penetration tester)\b/i,
  other: /.*/, // Matches anything
};

const inferRoleFromResume = (resumeRole: string): ResumeRole => {
  const normalizedRole = resumeRole.toLowerCase();

  const rolesInPriorityOrder: ResumeRole[] = [
    'machine-learning',
    'data-scientist',
    'security',
    'designer',
    'devops',
    'fullstack',
    'frontend',
    'backend',
    'qa',
    'pm',
  ];

  for (const role of rolesInPriorityOrder) {
    if (ROLE_PATTERNS[role].test(normalizedRole)) {
      return role;
    }
  }

  return 'other';
};

const MainResumeContent: FC = () => {
  const { resume: selectedResume, error, loading } = useGetSelectedResume();
  const landingRef = useRef<HTMLDivElement | null>(null);
  const aboutMeRef = useRef<HTMLDivElement | null>(null);
  return (
    <MainLoading>
      <ThemeToggleFab />
      <Landing
        title={selectedResume?.name}
        id="landing"
        ref={landingRef}
        actionButtonProps={{
          children: 'Learn More',
          onClick: () => scrollToElement(aboutMeRef),
          endIcon: <ArrowForwardIcon />,
        }}
        error={error}
      />
      <Section title="About Me" id="about-me" ref={aboutMeRef} error={error}>
        {selectedResume?.summary}
      </Section>
      <SkillsSection
        skills={selectedResume?.skills}
        id="skills"
        error={error}
        loading={loading}
      />
      <WorkExperienceSection
        experiences={selectedResume?.experiences}
        id="work-experience"
        error={error}
      />
      {!!selectedResume?.title && (
        <Projects role={inferRoleFromResume(selectedResume?.title)} />
      )}
      <EducationSection
        educations={selectedResume?.educations}
        id="education-section"
        error={error}
      />
      <ScrollTop anchorRef={landingRef} />
      <Footer error={error} />
    </MainLoading>
  );
};

export default MainResumeContent;
