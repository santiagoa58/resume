import React, { FC, ReactNode } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from './WorkExperienceTabPanel';
import { IResumeExperience } from '../types/api_types';
import { Theme } from '@mui/material';

interface ITabMenuProps {
  workExperiences: IResumeExperience[] | undefined;
  children: (experience: IResumeExperience) => ReactNode;
}

const a11yProps = (value: string) => {
  return {
    id: `vertical-tab-${value}`,
    'aria-controls': `vertical-tabpanel-${value}`,
  };
};

const TabMenu: FC<ITabMenuProps> = (props) => {
  const [value, setValue] = React.useState(props.workExperiences?.[0].company);
  const matchesMediaQuery = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.up('sm')
  );

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    // update the value of the tab menu once the work experience is loaded
    if (value === undefined && props.workExperiences !== undefined) {
      setValue(props.workExperiences[0].company);
    }
  }, [props.workExperiences, value]);

  if (value === undefined) {
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection={matchesMediaQuery ? 'row' : 'column'}
      flexGrow={1}
      minHeight="100vh"
    >
      <Tabs
        selectionFollowsFocus
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Work Experience Tabs"
        sx={{
          ...(matchesMediaQuery ? { borderRight: 1 } : { borderBottom: 1 }),
          borderColor: 'divider',
        }}
        orientation={matchesMediaQuery ? 'vertical' : undefined}
      >
        {props.workExperiences?.map((experience) => (
          <Tab
            label={experience.company}
            {...a11yProps(experience.company)}
            value={experience.company}
            key={experience.company}
          />
        ))}
      </Tabs>
      {props.workExperiences?.map((experience) => (
        <TabPanel
          currentTab={value}
          value={experience.company}
          key={`${experience.company}-${experience.role}`}
          sx={matchesMediaQuery ? {} : { marginTop: '1em' }}
        >
          {props.children(experience)}
        </TabPanel>
      ))}
    </Box>
  );
};

export default TabMenu;
