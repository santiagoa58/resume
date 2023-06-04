import React, { FC } from 'react';
import ResumeSelector from '../resume_selector/ResumeSelector';
import { useSelectedResume } from '../hooks/useResume';
import Title from '../title/Title';
import Section from '../section/Section';

const Landing: FC = () => {
  const selectedResume = useSelectedResume();
  return (
    <div>
      <Title>{selectedResume?.name}</Title>
      <ResumeSelector />
      <Section title="About Me">{selectedResume?.summary}</Section>
      {selectedResume && (
        <>
          <h3>Skills</h3>
          <ul>
            {selectedResume?.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Landing;
