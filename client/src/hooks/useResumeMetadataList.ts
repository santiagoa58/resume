import { useContext, useCallback, Dispatch } from 'react';
import {
  ResumeMetadataListContext,
  ResumeMetadataListDispatchContext,
  SelectedResumeContext,
  SelectedResumeDispatchContext,
} from '../resume_context/ResumeMetadataListContext';
import { IResumeMetadata } from '../types/api_types';
import { ResumeMetadataListAction } from '../state/resumeMetadataList';
import useAPIWithErrorHandling from './useAPIWithErrorHandling';

export const useResumeMetadataListState = (): [
  IResumeMetadata[],
  Dispatch<ResumeMetadataListAction>
] => {
  const resumeMetadataList = useContext(ResumeMetadataListContext);
  const resumeMetadataListDispatch = useContext(
    ResumeMetadataListDispatchContext
  );
  // if context is null, throw error
  if (resumeMetadataList == null || resumeMetadataListDispatch == null) {
    throw new Error(
      'useResumeMetadataListState must be used within a ResumeMetadataListProvider'
    );
  }
  return [resumeMetadataList, resumeMetadataListDispatch];
};

export const useGetResumeMetadataList = () => {
  const { fetchAllResumes, loadingResumes, errorResumes } =
    useAPIWithErrorHandling();
  const [resumeMetadataList, dispatchResumeMetadataList] =
    useResumeMetadataListState();

  const getResumeMetadataList = useCallback(async () => {
    const resumesMetadata = await fetchAllResumes();
    resumesMetadata &&
      dispatchResumeMetadataList({
        type: 'SET_RESUME_LIST',
        payload: resumesMetadata,
      });
  }, [fetchAllResumes, dispatchResumeMetadataList]);

  return [
    resumeMetadataList,
    getResumeMetadataList,
    loadingResumes,
    errorResumes,
  ] as const;
};

export const useSelectedResumeState = (): [
  IResumeMetadata | undefined,
  (selectedResume: IResumeMetadata) => void
] => {
  const selectedResume = useContext(SelectedResumeContext);
  const selectedResumeDispatch = useContext(SelectedResumeDispatchContext);
  // if context is null, throw error
  if (selectedResume === null || selectedResumeDispatch === null) {
    throw new Error(
      'useSelectedResumeState must be used within a SelectedResumeProvider'
    );
  }
  const setSelectedResume = useCallback(
    (selectedResume: IResumeMetadata) => {
      selectedResumeDispatch({
        type: 'SET_SELECTED_RESUME',
        payload: selectedResume,
      });
    },
    [selectedResumeDispatch]
  );

  return [selectedResume, setSelectedResume];
};
