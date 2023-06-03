import React, { FC } from 'react';
import ResumeSelector from '../resume_selector/ResumeSelector';
import { useSelectedResume } from '../hooks/useResume';

const Landing: FC = () => {
  const selectedResume = useSelectedResume();
  return (
    <div>
      <h1>{selectedResume?.name}</h1>
      <ResumeSelector />
      {selectedResume && (
        <>
          <h3>Summary</h3>
          <p>{selectedResume.summary}</p>
          <h3>Skills</h3>
          <ul>
            {selectedResume.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
          <h3></h3>
        </>
      )}
    </div>
  );
};

export default Landing;
