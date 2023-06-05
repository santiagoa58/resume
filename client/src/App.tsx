import React from 'react';
import ThemeProvider from './theme/ThemeProvider';
import { ResumeMetadataListProvider } from './context/ResumeMetadataListContextProvider';
import { ResumeContextProvider } from './context/ResumeContextProvider';
import Container from '@mui/material/Container';
import MainResumeContent from './MainResumeContent';

function App() {
  return (
    <ThemeProvider>
      <ResumeMetadataListProvider>
        <ResumeContextProvider>
          <Container>
            <MainResumeContent />
          </Container>
        </ResumeContextProvider>
      </ResumeMetadataListProvider>
    </ThemeProvider>
  );
}

export default App;
