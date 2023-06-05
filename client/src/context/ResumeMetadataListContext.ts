import { createContext, Dispatch } from 'react';
import { IResumeMetadata } from '../types/api_types';
import { ResumeMetadataListAction } from '../state/resumeMetadataList';
import { SelectResumeAction } from '../state/selectedResume';

export const ResumeMetadataListContext = createContext<null | IResumeMetadata[]>(null);
export const ResumeMetadataListDispatchContext =
  createContext<null | Dispatch<ResumeMetadataListAction>>(null);
export const SelectedResumeContext = createContext<
  null | undefined | IResumeMetadata
>(null);
export const SelectedResumeDispatchContext =
  createContext<null | Dispatch<SelectResumeAction>>(null);
