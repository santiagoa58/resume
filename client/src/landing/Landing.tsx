import React, { FC } from 'react';
import ResumeSelector from '../resume_selector/ResumeSelector';
import { useSelectedResume } from '../hooks/useResume';
import Title from '../title/Title';

const Landing: FC = () => {
  const selectedResume = useSelectedResume();
  return (
    <div>
      <Title>{selectedResume?.name}</Title>
      <ResumeSelector />
      {selectedResume && (
        <>
          <h3>Summary</h3>
          <p>{selectedResume.summary}</p>
          <h3>Skills</h3>
          <ul>
            {selectedResume.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Landing;
