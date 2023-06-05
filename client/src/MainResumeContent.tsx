import React, { FC, useState, useEffect } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Landing from './landing/Landing';
import Section from './section/Section';
import { useGetSelectedResume } from './hooks/useResume';
import { useGetResumeMetadataList } from './hooks/useResumeMetadataList';
import Fade from '@mui/material/Fade';

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

const MainResumeContent: FC = () => {
  const selectedResume = useGetSelectedResume();
  const loading = useLoadResumeMetadataList();
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100%',
        }}
      >
        <Fade in>
          <LinearProgress
            sx={{ width: '75%' }}
            aria-label="resume-list-progress"
          />
        </Fade>
      </Box>
    );
  }
  return (
    <Fade in={!loading}>
      <div aria-describedby="resume-list-progress" aria-busy={loading}>
        <Landing title={selectedResume?.name} />
        <Section title="About Me">{selectedResume?.summary}</Section>
      </div>
    </Fade>
  );
};

export default MainResumeContent;
