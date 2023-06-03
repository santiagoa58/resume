import React, { FC, PropsWithChildren, useReducer } from 'react';
import {
  ResumeListContext,
  ResumeListDispatchContext,
  SelectedResumeContext,
  SelectedResumeDispatchContext,
} from './ResumeListContext';
import { initialResumeListState, resumeListReducer } from '../state/resumeList';
import { selectResumeReducer } from '../state/selectedResume';

export const ResumeListProvider: FC<PropsWithChildren> = (props) => {
  const [resumeList, resumeListDispatch] = useReducer(
    resumeListReducer,
    initialResumeListState
  );
  const [selectedResume, selectedResumeDispatch] = useReducer(
    selectResumeReducer,
    undefined
  );
  return (
    <ResumeListContext.Provider value={resumeList}>
      <ResumeListDispatchContext.Provider value={resumeListDispatch}>
        <SelectedResumeContext.Provider value={selectedResume}>
          <SelectedResumeDispatchContext.Provider
            value={selectedResumeDispatch}
          >
            {props.children}
          </SelectedResumeDispatchContext.Provider>
        </SelectedResumeContext.Provider>
      </ResumeListDispatchContext.Provider>
    </ResumeListContext.Provider>
  );
};
