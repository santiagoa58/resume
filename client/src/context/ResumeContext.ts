import { createContext, Dispatch } from 'react';
import { IResume } from '../types/api_types';
import { ResumeAction } from '../state/resume';

export const ResumeContext = createContext<null | undefined | IResume>(null);
export const ResumeDispatchContext =
  createContext<null | Dispatch<ResumeAction>>(null);
