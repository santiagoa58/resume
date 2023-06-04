/* eslint-disable no-console */
import React, { FC } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import * as Icons from '@mui/icons-material';
import { useSelectedResume } from '../hooks/useResume';
import { Skeleton } from '@mui/material';

type IconKey = keyof typeof Icons;

const stripIconName = (icon_name: string) => {
  return icon_name.replace(/Icon$/, '');
};

const getIconKeyFromContact = (
  contact: string,
  iconKeys: IconKey[]
): IconKey => {
  const matching_icon_keys = iconKeys.filter((icon_key) => {
    const icon_name = stripIconName(icon_key.toLowerCase());
    return contact.includes(icon_name);
  });
  if (matching_icon_keys.length === 0) {
    return 'Public';
  }
  if (matching_icon_keys.length === 1) {
    return matching_icon_keys[0];
  }
  //return the longest key since it represents a more specific match
  const icon_key = matching_icon_keys.reduce((prev, curr) => {
    return stripIconName(prev).length > stripIconName(curr).length
      ? prev
      : curr;
  });

  return icon_key;
};

const getIcon = (iconKey: IconKey): React.ReactNode => {
  return React.createElement(Icons[iconKey], { fontSize: 'inherit' });
};

const ContactButtonGroup: FC = () => {
  const selectedResume = useSelectedResume();
  const contacts = selectedResume?.contacts ?? [];
  const iconKeys = Object.keys(Icons) as Array<keyof typeof Icons>;
  //remove only the first contact that has @ which we assume is an email
  const emailIndex = contacts.findIndex((contact) => contact.includes('@'));
  const contacts_without_email = contacts.filter(
    (_contact, index) => index !== emailIndex
  );
  if (selectedResume === undefined) {
    return <Skeleton variant="circular" width="2em" height="2em" />;
  }
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {contacts_without_email.map((contact) => {
        console.log('contact: ', contact);
        const iconKey = getIconKeyFromContact(contact, iconKeys);
        console.log('iconKey: ', iconKey);
        return (
          <React.Fragment key={contact}>
            <IconButton
              color="primary"
              size="large"
              aria-label={stripIconName(iconKey).toLowerCase()}
            >
              {getIcon(iconKey)}
            </IconButton>
          </React.Fragment>
        );
      })}
    </Box>
  );
};
export default ContactButtonGroup;
