import React, {
  FC,
  ReactNode,
  createContext,
  Dispatch,
  useState,
  SetStateAction,
  useCallback,
} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';

interface IThemeProviderProps {
  children?: ReactNode;
}

const ThemeToggleContext = createContext<null | boolean>(null);

const ThemeToggleDispatchContext = createContext<null | Dispatch<
  SetStateAction<boolean>
>>(null);

// hook to update theme
export const useThemeToggleState = (): [boolean, VoidFunction] => {
  const isDarkMode = React.useContext(ThemeToggleContext);
  const setDarkMode = React.useContext(ThemeToggleDispatchContext);
  if (isDarkMode === null || setDarkMode === null) {
    throw new Error('useThemeToggle must be used within a ThemeToggleProvider');
  }
  return [
    isDarkMode,
    useCallback(() => {
      setDarkMode((prev) => !prev);
    }, [setDarkMode]),
  ];
};

const ThemeProvider: FC<IThemeProviderProps> = (props) => {
  const [darkMode, setDarkMode] = useState(true);
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
