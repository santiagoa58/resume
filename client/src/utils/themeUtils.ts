export const userPrefersDarkMode = (): boolean => {
  return getDarkThemePreferenceMediaQuery().matches;
};

export const getDarkThemePreferenceMediaQuery = (): MediaQueryList => {
  return window.matchMedia('(prefers-color-scheme: dark)');
};
