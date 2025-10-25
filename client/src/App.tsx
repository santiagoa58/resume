import React from 'react';
import ThemeProvider from './theme/ThemeProvider';
import { ResumeMetadataListProvider } from './resume_context/ResumeMetadataListContextProvider';
import { ResumeContextProvider } from './resume_context/ResumeContextProvider';
import Container from '@mui/material/Container';
import MainResumeContent from './MainResumeContent';
import { ProjectsProvider } from './projects/ProjectsContextProvider';
import { AIModelProvider } from './chatbot/context/AIModelContext';

function App() {
  return (
    <ThemeProvider>
      <ResumeMetadataListProvider>
        <ResumeContextProvider>
          <ProjectsProvider>
            <AIModelProvider>
              <Container>
                <MainResumeContent />
              </Container>
            </AIModelProvider>
          </ProjectsProvider>
        </ResumeContextProvider>
      </ResumeMetadataListProvider>
    </ThemeProvider>
  );
}

export default App;
