import React from 'react';
import ThemeProvider from './theme/ThemeProvider';
import { ResumeListProvider } from './context/ResumeListContextProvider';
import { ResumeContextProvider } from './context/ResumeContextProvider';
import Container from '@mui/material/Container';
import MainResumeContent from './MainResumeContent';

function App() {
  return (
    <ThemeProvider>
      <ResumeListProvider>
        <ResumeContextProvider>
          <Container>
            <MainResumeContent />
          </Container>
        </ResumeContextProvider>
      </ResumeListProvider>
    </ThemeProvider>
  );
}

export default App;
