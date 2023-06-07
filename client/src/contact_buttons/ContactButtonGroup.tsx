import React, { FC } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import * as Icons from '@mui/icons-material';
import { useGetSelectedResume } from '../hooks/useResume';
import { Link, Skeleton } from '@mui/material';

type IconKey = keyof typeof Icons;

const stripIconName = (icon_name: string) => {
  return icon_name.replace(/Icon$/, '');
};

const getContactUrl = (contact_url: string): string => {
  // Remove any trailing non-alphanumeric characters
  const clean_contact_url = contact_url.replace(/[^a-z0-9]+$/i, '');

  // Ensure the URL starts with 'https://'
  if (!/^https?:\/\//i.test(clean_contact_url)) {
    return `https://${clean_contact_url}`;
  }
  return clean_contact_url;
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
  const selectedResume = useGetSelectedResume();
  const contacts = selectedResume?.contacts ?? [];
  const iconKeys = Object.keys(Icons) as Array<keyof typeof Icons>;
  //remove only the first contact that has @ which we assume is an email
  const emailIndex = contacts.findIndex((contact) => contact.includes('@'));
  const contacts_without_email = contacts.filter(
    (_contact, index) => index !== emailIndex
  );
  return (
    <Box display="flex" gap="1em" justifyContent="center">
      {selectedResume === undefined ? (
        <Skeleton variant="circular" width="2em" height="2em" />
      ) : (
        contacts_without_email.map((contact) => {
          const iconKey = getIconKeyFromContact(contact, iconKeys);
          return (
            <Link key={contact} href={getContactUrl(contact)} target="_blank">
              <IconButton
                color="primary"
                size="large"
                aria-label={stripIconName(iconKey).toLowerCase()}
              >
                {getIcon(iconKey)}
              </IconButton>
            </Link>
          );
        })
      )}
    </Box>
  );
};
export default ContactButtonGroup;
