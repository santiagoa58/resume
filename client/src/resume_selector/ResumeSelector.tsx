import React, { FC, useEffect, useCallback } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  useResumeMetadataListState,
  useSelectedResumeState,
} from '../hooks/useResumeMetadataList';
import { useResumeState } from '../hooks/useResume';
import { IResumeMetadata } from '../types/api_types';

const useUpdateSelectedResume = () => {
  const [, setResume] = useSelectedResumeState();
  const [resume, resumeDispatch] = useResumeState();

  return useCallback(
    (selectedResume: IResumeMetadata) => {
      if (resume) {
        resumeDispatch({ type: 'REMOVE_RESUME' });
      }
      setResume(selectedResume);
    },
    [resumeDispatch, setResume, resume]
  );
};

export const ResumeSelector: FC<Pick<BoxProps, 'sx'>> = (props) => {
  const [resumeMetadataList] = useResumeMetadataListState();
  const [resume, setResume] = useSelectedResumeState();
  const updateSelectedResume = useUpdateSelectedResume();

  useEffect(() => {
    // set the first resume as the selected resume
    if (!resume && resumeMetadataList.length > 0) {
      setResume(resumeMetadataList[0]);
    }
  }, [resume, resumeMetadataList, setResume]);

  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.value != null) {
      const resume_id = event.target.value as string;
      const selectedResume = resumeMetadataList.find(
        (resume) => resume.id === resume_id
      );
      // throw error if selectedResume is undefined
      if (selectedResume === undefined) {
        throw new Error('invalid resume ID provided');
      }
      updateSelectedResume(selectedResume);
    }
  };

  return (
    <Box sx={{ width: '100%', ...props.sx }}>
      <FormControl variant="standard" fullWidth>
        <Select value={resume?.id ?? ''} onChange={handleChange}>
          {resumeMetadataList.map((resume) => (
            <MenuItem key={resume.id} value={resume.id}>
              {resume.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ResumeSelector;
