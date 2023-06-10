import { useState, useEffect } from 'react';
import useAPIWithErrorHandling from './useAPIWithErrorHandling';
import { IProject } from '../types/api_types';

const useProjects = () => {
  const { fetchAllProjects, loadingProjects, errorProjects } =
    useAPIWithErrorHandling();
  const [projects, setProjects] = useState<IProject[]>([]);

  useEffect(() => {
    const getProjects = async () => {
      const projectsFromServer = await fetchAllProjects();
      projectsFromServer && setProjects(projectsFromServer);
    };
    getProjects();
  }, [fetchAllProjects]);

  return { projects, loading: loadingProjects, error: errorProjects };
};

export default useProjects;
