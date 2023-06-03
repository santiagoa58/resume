import { useContext, useCallback, Dispatch } from 'react';
import useAPI from './useAPI';
import {
  ResumeListContext,
  ResumeListDispatchContext,
  SelectedResumeContext,
  SelectedResumeDispatchContext,
} from '../context/ResumeListContext';
import { IResumeMetadata } from '../types/api_types';
import { ResumeListAction } from '../state/resumeList';

export const useResumeListState = (): [
  IResumeMetadata[],
  Dispatch<ResumeListAction>
] => {
  const resumeList = useContext(ResumeListContext);
  const resumeListDispatch = useContext(ResumeListDispatchContext);
  // if context is null, throw error
  if (resumeList == null || resumeListDispatch == null) {
    throw new Error(
      'useResumeListState must be used within a ResumeListProvider'
    );
  }
  return [resumeList, resumeListDispatch];
};

export const useGetResumeList = (): [
  IResumeMetadata[],
  () => Promise<void>
] => {
  const { fetchAllResumes } = useAPI();
  const [resumeList, dispatchResumeList] = useResumeListState();

  const getResumeList = useCallback(async () => {
    const resumesMetadata = await fetchAllResumes();
    dispatchResumeList({ type: 'SET_RESUME_LIST', payload: resumesMetadata });
  }, [fetchAllResumes, dispatchResumeList]);

  return [resumeList, getResumeList];
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
