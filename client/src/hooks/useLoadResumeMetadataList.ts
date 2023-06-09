import { useState, useEffect } from 'react';
import { useGetResumeMetadataList } from '../hooks/useResumeMetadataList';

const useLoadResumeMetadataList = () => {
  const [, getResumeMetadataList] = useGetResumeMetadataList();
  const [loading, setLoading] = useState(true);

  // fetch resume List
  useEffect(() => {
    async function loadResumeMetadataList() {
      setLoading(true);
      await getResumeMetadataList();
      setLoading(false);
    }
    loadResumeMetadataList();
  }, [getResumeMetadataList]);

  return loading;
};

export default useLoadResumeMetadataList;
