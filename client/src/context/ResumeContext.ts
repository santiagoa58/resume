import {createContext, Dispatch} from 'react';
import {IResume} from '../types/api_types';
import {ResumeAction} from '../state/resume';

export const ResumeContext = createContext<null| I
>(null);
export const ResumeDispatchContext = createContext<null | Dispatch<ResumeAction>>(null);