import { createContext, Dispatch } from 'react';
import { IResumeMetadata } from '../types/api_types';
import { ResumeListAction } from '../state/resumeList';
import { SelectResumeAction } from '../state/selectedResume';

export const ResumeListContext = createContext<null | IResumeMetadata[]>(null);
export const ResumeListDispatchContext =
  createContext<null | Dispatch<ResumeListAction>>(null);
export const SelectedResumeContext = createContext<
  null | undefined | IResumeMetadata
>(null);
export const SelectedResumeDispatchContext =
  createContext<null | Dispatch<SelectResumeAction>>(null);
