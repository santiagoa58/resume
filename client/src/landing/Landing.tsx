import React, { FC, useContext } from 'react';
import ResumeSelector from '../resume_selector/ResumeSelector';
import { ResumeListContext } from '../services/ResumeListContextProvider';

const Landing: FC = () => {
  const resumes = useContext(ResumeListContext);
  return (
    <div>
      <h1>Name</h1>
      <ResumeSelector resumes={resumes} />
    </div>
  );
};

export default Landing;
