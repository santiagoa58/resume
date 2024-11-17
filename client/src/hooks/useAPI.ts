import { useCallback } from 'react';
import { IProject, IResume, IResumeMetadata } from '../types/api_types';

const RESUMES_ENDPOINT = 'resumes';
const PROJECTS_ENDPOINT = 'projects';

// base GET request function
const getRequest = async (url: string) => {
  url = encodeURI(url);
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

// get all resumes
const getResumes = async (baseURL: string): Promise<IResumeMetadata[]> => {
  const data = await getRequest(`${baseURL}/${RESUMES_ENDPOINT}`);
  return data;
};

// get all projects
const getProjects = async (
  baseURL: string,
  filters?: string
): Promise<IProject[]> => {
  filters = filters ? `?filters=${filters}` : '';
  const data = await getRequest(`${baseURL}/${PROJECTS_ENDPOINT}${filters}`);
  return data;
};

// get a single resume
const getResume = async (baseURL: string, id: string): Promise<IResume> => {
  const data = await getRequest(`${baseURL}/${RESUMES_ENDPOINT}/${id}`);
  return data;
};

const getBaseURL = (): string => {
  const base_api_url = process.env.REACT_APP_RESUME_API_URL;
  if (!base_api_url) {
    throw new Error('No base url provided');
  }
  return base_api_url;
};

/**
 * hook that provides access to the API
 */
export const useAPI = () => {
  const base_api_url = getBaseURL();
  const fetchAllResumes = useCallback(async () => {
    const resumes = await getResumes(base_api_url);
    return resumes;
  }, [base_api_url]);

  const fetchResumeDetails = useCallback(
    async (id: string) => {
      const resume = await getResume(base_api_url, id);
      return resume;
    },
    [base_api_url]
  );

  const fetchAllProjects = useCallback(
    async (filters?: string) => {
      const projects = await getProjects(base_api_url, filters);
      return projects;
    },
    [base_api_url]
  );

  return {
    fetchAllResumes,
    fetchResumeDetails,
    fetchAllProjects,
  };
};

export default useAPI;
