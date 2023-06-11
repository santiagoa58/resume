import React from 'react';
import ThemeProvider from './theme/ThemeProvider';
import { ResumeMetadataListProvider } from './context/ResumeMetadataListContextProvider';
import { ResumeContextProvider } from './context/ResumeContextProvider';
import Container from '@mui/material/Container';
import MainResumeContent from './MainResumeContent';
import { ProjectsProvider } from './context/ProjectsContextProvider';

function App() {
  return (
    <ThemeProvider>
      <ResumeMetadataListProvider>
        <ResumeContextProvider>
          <ProjectsProvider>
            <Container>
              <MainResumeContent />
            </Container>
          </ProjectsProvider>
        </ResumeContextProvider>
      </ResumeMetadataListProvider>
    </ThemeProvider>
  );
}

export default App;
