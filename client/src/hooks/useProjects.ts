import { useContext, useEffect } from 'react';
import {
  ProjectsContext,
  ProjectsDispatchContext,
} from '../projects/ProjectsContext';
import { ResumeRole } from '../types/resume';
import useAPIWithErrorHandling from './useAPIWithErrorHandling';

export const useProjectsState = () => {
  const projects = useContext(ProjectsContext);
  const projectsDispatch = useContext(ProjectsDispatchContext);

  // if context is null, throw error
  if (projects == null || projectsDispatch == null) {
    throw new Error('useProjectsState must be used within a ProjectsProvider');
  }
  return [projects, projectsDispatch] as const;
};

const useProjects = (role?: ResumeRole) => {
  const { fetchAllProjects, loadingProjects, errorProjects } =
    useAPIWithErrorHandling();
  const [projects, projectsDispatch] = useProjectsState();

  useEffect(() => {
    const getProjects = async () => {
      const projectsFromServer = await fetchAllProjects(role);
      projectsFromServer &&
        projectsDispatch({
          type: 'SET_PROJECT_LIST',
          payload: projectsFromServer.sort((projectA, projectB) => {
            const projectALastPush = projectA.pushed_at;
            const projectBLastPush = projectB.pushed_at;
            if (projectALastPush == null && projectBLastPush == null) {
              return 0;
            }
            if (projectALastPush == null) {
              return 1;
            }
            if (projectBLastPush == null) {
              return -1;
            }
            return projectALastPush > projectBLastPush ? -1 : 1;
          }),
        });
    };
    getProjects();
  }, [fetchAllProjects, projectsDispatch, role]);

  return { projects, loading: loadingProjects, error: errorProjects };
};

export default useProjects;
