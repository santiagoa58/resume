import React, { FC, PropsWithChildren, useReducer } from 'react';
import { ProjectsContext, ProjectsDispatchContext } from './ProjectsContext';
import { projectReducer, initialProjectState } from '../state/projects';

export const ProjectsProvider: FC<PropsWithChildren> = (props) => {
  const [projects, projectsDispatch] = useReducer(
    projectReducer,
    initialProjectState
  );
  return (
    <ProjectsContext.Provider value={projects}>
      <ProjectsDispatchContext.Provider value={projectsDispatch}>
        {props.children}
      </ProjectsDispatchContext.Provider>
    </ProjectsContext.Provider>
  );
};
