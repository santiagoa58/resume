import React, { FC, ReactNode, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';
import {
  ThemeToggleContext,
  ThemeToggleDispatchContext,
} from './ThemeToggleContext';
import { userPrefersDarkMode } from '../utils/themeUtils';

interface IThemeProviderProps {
  children?: ReactNode;
}
const ThemeProvider: FC<IThemeProviderProps> = (props) => {
  const [darkMode, setDarkMode] = useState(userPrefersDarkMode());
  return (
    <ThemeToggleContext.Provider value={darkMode}>
      <ThemeToggleDispatchContext.Provider value={setDarkMode}>
        <MuiThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <CssBaseline />
          {props.children}
        </MuiThemeProvider>
      </ThemeToggleDispatchContext.Provider>
    </ThemeToggleContext.Provider>
  );
};

export default ThemeProvider;
