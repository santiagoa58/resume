import { useContext, useCallback, useEffect, Dispatch } from 'react';
import {
  ResumeContext,
  ResumeDispatchContext,
} from '../resume_context/ResumeContext';
import { ResumeAction, ResumeState } from '../state/resume';
import { useSelectedResumeState } from './useResumeMetadataList';
import useAPIWithErrorHandling from './useAPIWithErrorHandling';

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
  const { fetchResumeDetails, errorResumeDetails, loadingResumeDetails } =
    useAPIWithErrorHandling();
  const [resumeState, dispatchResume] = useResumeState();

  const getResume = useCallback(
    async (resumeId: string, force: boolean = false) => {
      if (!resumeState.has(resumeId) || force) {
        // only fetch the resume if it's not already in state
        const resumeResponse = await fetchResumeDetails(resumeId);
        resumeResponse &&
          dispatchResume({ type: 'SET_RESUME', payload: resumeResponse });
      }
    },
    [fetchResumeDetails, dispatchResume, resumeState]
  );

  return {
    getResume,
    loading: loadingResumeDetails,
    error: errorResumeDetails,
  };
};

export const useSelectedResume = () => {
  const [selectedResumeMetadata] = useSelectedResumeState();
  const [resumeState] = useResumeState();

  if (selectedResumeMetadata && resumeState.has(selectedResumeMetadata.id)) {
    return resumeState.get(selectedResumeMetadata.id);
  }

  return undefined;
};

export const useGetSelectedResume = () => {
  const { getResume, loading, error } = useGetResume();
  const [selectedResumeMetadata] = useSelectedResumeState();
  const selectedResume = useSelectedResume();

  // fetch the resume whenever the selected resume is changed
  useEffect(() => {
    if (selectedResumeMetadata) {
      getResume(selectedResumeMetadata.id);
    }
  }, [getResume, selectedResumeMetadata]);

  return { resume: selectedResume, loading, error };
};
