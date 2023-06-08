import React, { FC, ReactNode } from 'react';
import {
  ThemeProvider as MuiThemeProvider,
  useTheme,
  Theme,
} from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';

interface IInvertedNestedThemeProviderProps {
  children?: ReactNode;
}

const getInvertedTheme = (theme: Theme): Theme => {
  if (theme.palette.mode === 'light') {
    return darkTheme;
  }
  return lightTheme;
};

const InvertedNestedThemeProvider: FC<IInvertedNestedThemeProviderProps> = (
  props
) => {
  const theme = useTheme();

  return (
    <MuiThemeProvider theme={getInvertedTheme(theme)}>
      {props.children}
    </MuiThemeProvider>
  );
};

export default InvertedNestedThemeProvider;
