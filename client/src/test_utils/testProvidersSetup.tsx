import React, { FC, PropsWithChildren } from 'react';
import { ResumeContextProvider } from '../context/ResumeContextProvider';
import { ResumeMetadataListProvider } from '../context/ResumeMetadataListContextProvider';
import ThemeProvider from '../theme/ThemeProvider';

const TestProviders: FC<PropsWithChildren> = (props) => {
  return (
    <ThemeProvider>
      <ResumeMetadataListProvider>
        <ResumeContextProvider>{props.children}</ResumeContextProvider>
      </ResumeMetadataListProvider>
    </ThemeProvider>
  );
};

export default TestProviders;
