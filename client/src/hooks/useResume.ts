import { useContext, useCallback, useEffect, Dispatch } from 'react';
import useAPI from './useAPI';
import { ResumeContext, ResumeDispatchContext } from '../context/ResumeContext';
import { IResume } from '../types/api_types';
import { ResumeAction, ResumeState } from '../state/resume';
import { useSelectedResumeState } from './useResumeMetadataList';

// get the resume state and dispatch from context
export const useResumeState = (): [ResumeState, Dispatch<ResumeAction>] => {
  const resume = useContext(ResumeContext);
  const resumeDispatch = useContext(ResumeDispatchContext);
  if (resume === null || resumeDispatch == null) {
    throw new Error('useResumeState must be used within a ResumeProvider');
  }
  return [resume, resumeDispatch];
};

// fetches the resume from the API and sets it in state
export const useGetResume = () => {
  const { fetchResumeDetails } = useAPI();
  const [resumeState, dispatchResume] = useResumeState();

  return useCallback(
    async (resumeId: string, force: boolean = false) => {
      if (!resumeState.has(resumeId) || force) {
        // only fetch the resume if it's not already in state
        const resumeResponse = await fetchResumeDetails(resumeId);
        dispatchResume({ type: 'SET_RESUME', payload: resumeResponse });
      }
    },
    [fetchResumeDetails, dispatchResume, resumeState]
  );
};

export const useGetSelectedResume = (): IResume | undefined => {
  const getResume = useGetResume();
  const [selectedResumeMetadata] = useSelectedResumeState();
  const [resumeState] = useResumeState();

  // fetch the resume whenever the selected resume is changed
  useEffect(() => {
    if (selectedResumeMetadata) {
      getResume(selectedResumeMetadata.id);
    }
  }, [getResume, selectedResumeMetadata]);

  if (selectedResumeMetadata && resumeState.has(selectedResumeMetadata.id)) {
    return resumeState.get(selectedResumeMetadata.id);
  }

  return undefined;
};
