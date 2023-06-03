import React, { FC, useEffect } from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  useGetResumeList,
  useSelectedResumeState,
} from '../hooks/useResumeList';

export const ResumeSelector: FC = () => {
  const [resumeList, getResumeList] = useGetResumeList();
  const [resume, setResume] = useSelectedResumeState();

  useEffect(() => {
    getResumeList();
  }, [getResumeList]);

  useEffect(() => {
    // set the first resume as the selected resume
    if (!resume && resumeList.length > 0) {
      setResume(resumeList[0]);
    }
  }, [resume, resumeList, setResume]);

  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.value != null) {
      const resume_id = event.target.value as string;
      const selectedResume = resumeList.find(
        (resume) => resume.id === resume_id
      );
      // throw error if selectedResume is undefined
      if (selectedResume === undefined) {
        throw new Error('invalid resume ID provided');
      }
      setResume(selectedResume);
    }
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select value={resume?.id ?? ''} onChange={handleChange}>
          {resumeList.map((resume) => (
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