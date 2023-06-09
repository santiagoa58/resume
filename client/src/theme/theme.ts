import {
  createTheme,
  responsiveFontSizes,
  ThemeOptions,
} from '@mui/material/styles';
import { blue, orange } from '@mui/material/colors';

const defaultTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: blue,
    secondary: orange,
  },
  typography: {
    fontFamily: ['Roboto Mono', 'monospace'].join(','),
    fontSize: 14,
  },
};

const darkThemeWithoutResponsiveFontSizes = createTheme({
  ...defaultTheme,
  palette: {
    ...defaultTheme.palette,
    mode: 'dark',
  },
});

const lightThemeWithoutResponsiveFontSizes = createTheme({
  ...defaultTheme,
});

export const lightTheme = responsiveFontSizes(
  lightThemeWithoutResponsiveFontSizes
);
export const darkTheme = responsiveFontSizes(
  darkThemeWithoutResponsiveFontSizes
);
