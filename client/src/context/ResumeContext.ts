import { createContext, Dispatch } from 'react';
import { ResumeAction, ResumeState } from '../state/resume';

export const ResumeContext = createContext<null | ResumeState>(null);
export const ResumeDispatchContext =
  createContext<null | Dispatch<ResumeAction>>(null);
