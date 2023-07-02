import React, { FC, PropsWithChildren } from 'react';
import { ResumeContextProvider } from '../resume_context/ResumeContextProvider';
import { ResumeMetadataListProvider } from '../resume_context/ResumeMetadataListContextProvider';
import ThemeProvider from '../theme/ThemeProvider';
import { ProjectsProvider } from '../projects/ProjectsContextProvider';

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
