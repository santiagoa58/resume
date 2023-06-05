import React, { FC, PropsWithChildren, useReducer } from 'react';
import {
  ResumeMetadataListContext,
  ResumeMetadataListDispatchContext,
  SelectedResumeContext,
  SelectedResumeDispatchContext,
} from './ResumeMetadataListContext';
import {
  initialResumeMetadataListState,
  resumeMetadataListReducer,
} from '../state/resumeMetadataList';
import { selectResumeReducer } from '../state/selectedResume';

export const ResumeMetadataListProvider: FC<PropsWithChildren> = (props) => {
  const [resumeMetadataList, resumeMetadataListDispatch] = useReducer(
    resumeMetadataListReducer,
    initialResumeMetadataListState
  );
  const [selectedResume, selectedResumeDispatch] = useReducer(
    selectResumeReducer,
    undefined
  );
  return (
    <ResumeMetadataListContext.Provider value={resumeMetadataList}>
      <ResumeMetadataListDispatchContext.Provider
        value={resumeMetadataListDispatch}
      >
        <SelectedResumeContext.Provider value={selectedResume}>
          <SelectedResumeDispatchContext.Provider
            value={selectedResumeDispatch}
          >
            {props.children}
          </SelectedResumeDispatchContext.Provider>
        </SelectedResumeContext.Provider>
      </ResumeMetadataListDispatchContext.Provider>
    </ResumeMetadataListContext.Provider>
  );
};
