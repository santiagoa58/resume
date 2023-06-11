import { createContext, Dispatch } from 'react';
import { ProjectAction } from '../state/projects';
import { IProject } from '../types/api_types';

export const ProjectsContext = createContext<null | IProject[]>(null);
export const ProjectsDispatchContext =
  createContext<null | Dispatch<ProjectAction>>(null);
