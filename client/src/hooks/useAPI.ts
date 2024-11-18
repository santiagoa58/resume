import { useCallback, useRef } from 'react';
import { IProject, IResume, IResumeMetadata } from '../types/api_types';

const RESUMES_ENDPOINT = 'resumes';
const PROJECTS_ENDPOINT = 'projects';

// base GET request function
const getRequest = async (url: string, signal: AbortSignal) => {
  url = encodeURI(url);
  const response = await fetch(url, { signal });
  const data = await response.json();
  return data;
};

// get all resumes
const getResumes = async (
  signal: AbortSignal,
  baseURL: string
): Promise<IResumeMetadata[]> => {
  const data = await getRequest(`${baseURL}/${RESUMES_ENDPOINT}`, signal);
  return data;
};

// get all projects
const getProjects = async (
  signal: AbortSignal,
  baseURL: string,
  filters?: string
): Promise<IProject[]> => {
  filters = filters ? `?filters=${filters}` : '';
  const data = await getRequest(
    `${baseURL}/${PROJECTS_ENDPOINT}${filters}`,
    signal
  );
  return data;
};

// get a single resume
const getResume = async (
  signal: AbortSignal,
  baseURL: string,
  id: string
): Promise<IResume> => {
  const data = await getRequest(`${baseURL}/${RESUMES_ENDPOINT}/${id}`, signal);
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
  const abortControllers = useRef(new Map<string, AbortController>());
  const createAbortController = (key: string) => {
    if (abortControllers.current.has(key)) {
      abortControllers.current.get(key)!.abort();
    }
    const controller = new AbortController();
    abortControllers.current.set(key, controller);
    return controller;
  };

  const fetchAllResumes = useCallback(async () => {
    const controller = createAbortController('fetchAllResumes');
    const resumes = await getResumes(controller.signal, base_api_url);
    return resumes;
  }, [base_api_url]);

  const fetchResumeDetails = useCallback(
    async (id: string) => {
      const controller = createAbortController('fetchResumeDetails');
      const resume = await getResume(controller.signal, base_api_url, id);
      return resume;
    },
    [base_api_url]
  );

  const fetchAllProjects = useCallback(
    async (filters?: string) => {
      const controller = createAbortController('fetchAllProjects');
      const projects = await getProjects(
        controller.signal,
        base_api_url,
        filters
      );
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
