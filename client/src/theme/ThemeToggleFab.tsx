import React, { FC, useEffect, useCallback } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';
import Box, { BoxProps } from '@mui/material/Box';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import {
  ThemeToggleContext,
  ThemeToggleDispatchContext,
} from './ThemeToggleContext';
import { getDarkThemePreferenceMediaQuery } from '../utils/themeUtils';

// hook to update theme
export const useThemeToggleState = () => {
  const isDarkMode = React.useContext(ThemeToggleContext);
  const setDarkMode = React.useContext(ThemeToggleDispatchContext);
  if (isDarkMode === null || setDarkMode === null) {
    throw new Error('useThemeToggle must be used within a ThemeToggleProvider');
  }

  // update theme when user preferences changes
  useEffect(() => {
    const mediaQuery = getDarkThemePreferenceMediaQuery();
    const handleChange = () => setDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, [setDarkMode]);

  return [isDarkMode, toggleTheme] as const;
};

const ThemeToggleFab: FC<BoxProps> = (props) => {
  const [darkMode, toggleDarkMode] = useThemeToggleState();
  const trigger = useScrollTrigger();

  return (
    <Zoom in={!trigger}>
      <Box
        onClick={() => toggleDarkMode()}
        position="fixed"
        top={16}
        right={16}
        zIndex={999}
        {...props}
      >
        <Fab color="default" size="small" aria-label="toggle theme">
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </Fab>
      </Box>
    </Zoom>
  );
};

export default ThemeToggleFab;
