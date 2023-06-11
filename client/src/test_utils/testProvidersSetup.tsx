import React, { FC, PropsWithChildren } from 'react';
import { ResumeContextProvider } from '../context/ResumeContextProvider';
import { ResumeMetadataListProvider } from '../context/ResumeMetadataListContextProvider';
import ThemeProvider from '../theme/ThemeProvider';
import { ProjectsProvider } from '../context/ProjectsContextProvider';

const TestProviders: FC<PropsWithChildren> = (props) => {
  return (
    <ThemeProvider>
      <ResumeMetadataListProvider>
        <ProjectsProvider>
          <ResumeContextProvider>{props.children}</ResumeContextProvider>
        </ProjectsProvider>
      </ResumeMetadataListProvider>
    </ThemeProvider>
  );
};

export default TestProviders;
