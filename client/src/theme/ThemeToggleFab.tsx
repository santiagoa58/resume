import React, { FC } from 'react';
import { useThemeToggleState } from './ThemeProvider';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';
import Box, { BoxProps } from '@mui/material/Box';
import useScrollTrigger from '@mui/material/useScrollTrigger';

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
