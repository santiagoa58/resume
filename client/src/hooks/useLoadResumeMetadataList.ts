import { useEffect } from 'react';
import { useGetResumeMetadataList } from '../hooks/useResumeMetadataList';

const useLoadResumeMetadataList = () => {
  const [metadataList, getResumeMetadataList, loading, error] =
    useGetResumeMetadataList();

  // fetch resume List
  useEffect(() => {
    async function loadResumeMetadataList() {
      await getResumeMetadataList();
    }
    loadResumeMetadataList();
  }, [getResumeMetadataList]);

  return [metadataList, loading, error] as const;
};

export default useLoadResumeMetadataList;
