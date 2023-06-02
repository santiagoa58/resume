import React, {
  FC,
  PropsWithChildren,
  useState,
  createContext,
  useEffect,
} from 'react';
import useAPI from './useAPI';
import { IResumeMetadata } from '../types/api_types';

export const ResumeListContext = createContext<IResumeMetadata[]>([]);

const useGetResumeList = () => {
  const { fetchAllResumes } = useAPI();
  const [resumeList, setResumeList] = useState<IResumeMetadata[]>([]);

  useEffect(() => {
    async function getResumeList() {
      const resumesMetadata = await fetchAllResumes();
      setResumeList(resumesMetadata);
    }
    getResumeList();
  }, [fetchAllResumes]);

  return resumeList;
};

export const ResumeListProvider: FC<PropsWithChildren> = (props) => {
  const resumes = useGetResumeList();
  return (
    <ResumeListContext.Provider value={resumes}>
      {props.children}
    </ResumeListContext.Provider>
  );
};
