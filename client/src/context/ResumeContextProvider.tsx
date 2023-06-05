import React, { FC, PropsWithChildren, useReducer } from 'react';
import { ResumeContext, ResumeDispatchContext } from './ResumeContext';
import { resumeReducer, initialResumeState } from '../state/resume';

export const ResumeContextProvider: FC<PropsWithChildren> = (props) => {
  const [resume, resumeDispatch] = useReducer(
    resumeReducer,
    initialResumeState
  );

  return (
    <ResumeContext.Provider value={resume}>
      <ResumeDispatchContext.Provider value={resumeDispatch}>
        {props.children}
      </ResumeDispatchContext.Provider>
    </ResumeContext.Provider>
  );
};
