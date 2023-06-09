import React, { FC, PropsWithChildren } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import useLoadResumeMetadataList from '../hooks/useLoadResumeMetadataList';

const MainLoading: FC<PropsWithChildren> = (props) => {
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
        {props.children}
      </div>
    </Fade>
  );
};

export default MainLoading;
