import React, { FC } from 'react';
import Box, { BoxProps } from '@mui/material/Box';

interface ITabPanelProps extends BoxProps {
  children?: React.ReactNode;
  value: string;
  currentTab: string;
}

const TabPanel: FC<ITabPanelProps> = ({
  children,
  value,
  currentTab,
  sx,
  ...props
}) => {
  return (
    <Box
      sx={{ marginX: '1em', width: '100%', ...sx }}
      role="tabpanel"
      hidden={value !== currentTab}
      id={`vertical-tabpanel-${value}`}
      aria-labelledby={`vertical-tab-${value}`}
      {...props}
    >
      {value === currentTab && children}
    </Box>
  );
};

export default TabPanel;
