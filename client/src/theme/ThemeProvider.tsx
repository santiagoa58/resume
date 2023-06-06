import React, { FC, ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';

interface IThemeProviderProps {
  darkMode?: boolean;
  children?: ReactNode;
}

const ThemeProvider: FC<IThemeProviderProps> = (props) => {
  return (
    <MuiThemeProvider theme={props.darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      {props.children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
