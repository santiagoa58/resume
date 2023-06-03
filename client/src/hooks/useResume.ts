import {useContext, useCallback, useEffect, Dispatch} from 'react';
import useAPI from './useAPI';
import {ResumeContext, ResumeDispatchContext} from '../context/ResumeContext';
import {IResume} from '../types/api_types';
import {ResumeAction} from '../state/resume';

export const useResumeState = (): [
    IResume | undefined,
    Dispatch<ResumeAction>
] => {
    const resume = useContext(ResumeContext);
    const resumeDispatch = useContext(ResumeDispatchContext);
    if(resume === null || resumeDispatch == null){
        throw new Error(
            'useResumeState must be used within a ResumeProvider'
        );
    }
    return [resume, resumeDispatch];
};

export const useGetResume = (): [
    IResume, 
    (resumeId: string) => Promise<void>
] => {
    const {fetchResumeDetails} = useAPI();
    const [resume, dispatchResume] = useResumeState();
    const getResume = useCallback(async (resumeId: string) => {
       const resumeResponse = await fetchResumeDetails(resumeId);
       dispatchResume({type: 'SET_RESUME', payload: resumeResponse});
    }, [fetchResumeDetails]);

    return [resume, getResume];
};

export const useSelectedResume = (): IResume => {
    const [resume, getResume] = useGetResume();
    const [selectedResumeMetadata, _] = useSelectedResumeState();

    // fetch the resume whenever the selected resume is changed
    useEffect(() => {
        if(selectedResumeMetadata && resume?.id !== selectedResumeMetadata.id){
            getResume(selectedResumeMetadata.id);
        }
    }, [getResume, selectedResume, resume]);

    return resume;
};