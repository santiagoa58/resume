import useAPI from './useAPI';
import useWithErrorHandling from './useWithErrorHandling';

const useAPIWithErrorHandling = () => {
  const { fetchAllResumes, fetchResumeDetails, fetchAllProjects } = useAPI();
  const [fetchAllResumesWithErrorHandling, loadingResumes, errorResumes] =
    useWithErrorHandling(fetchAllResumes, 'Error fetching resumes');
  const [
    fetchResumeDetailsWithErrorHandling,
    loadingResumeDetails,
    errorResumeDetails,
  ] = useWithErrorHandling(fetchResumeDetails, 'Error fetching resume details');
  const [fetchAllProjectsWithErrorHandling, loadingProjects, errorProjects] =
    useWithErrorHandling(fetchAllProjects, 'Error fetching projects');

  return {
    fetchAllResumes: fetchAllResumesWithErrorHandling,
    fetchResumeDetails: fetchResumeDetailsWithErrorHandling,
    fetchAllProjects: fetchAllProjectsWithErrorHandling,
    loadingResumes,
    loadingResumeDetails,
    loadingProjects,
    errorResumes,
    errorResumeDetails,
    errorProjects,
  };
};

export default useAPIWithErrorHandling;
