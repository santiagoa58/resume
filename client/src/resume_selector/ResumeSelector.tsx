import React, { FC, useEffect } from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IResumeMetadata } from '../types/api_types';

interface IResumeSelectorProps {
  resumes: IResumeMetadata[] | undefined;
}

export const ResumeSelector: FC<IResumeSelectorProps> = (props) => {
  const [resume, setResume] = React.useState(props.resumes?.[0]?.id ?? '');

  useEffect(() => {
    if (!resume && !!props.resumes?.length) {
      setResume(props.resumes[0].id);
    }
  }, [props.resumes, resume]);

  const handleChange = (event: SelectChangeEvent) => {
    setResume(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select value={resume} onChange={handleChange}>
          {props.resumes?.map((resume) => (
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
