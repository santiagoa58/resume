import React, { FC } from 'react';
import Typography from '@mui/material/Typography';
import { IProject } from '../types/api_types';
import { getUniqueArrayEntries } from '../utils/objectUtils';
import {
  MAIN_PROJECT,
  OUTDATED_PROJECT,
  SKILLS_VARIETY,
} from '../utils/constants';

export enum COMMANDS {
  LIST_SKILLS = 'list skills',
  HELP = 'help',
  CLEAR = 'clear',
  LIST_PROJECT_SKILLS = 'list project skills',
  // command to describe a project
  DESCRIBE_PROJECT = 'describe',
  LIST_PROJECTS = 'list projects',
  SKILL_SEARCH = 'search',
}

// map of all commands as key and descriptions as value
export const COMMANDS_DESCRIPTION: Record<COMMANDS, string> = {
  [COMMANDS.LIST_SKILLS]: 'List all my skills',
  [COMMANDS.LIST_PROJECTS]: 'List all my projects',
  [COMMANDS.HELP]: 'List all available commands',
  [COMMANDS.CLEAR]: 'Clear the terminal',
  [COMMANDS.LIST_PROJECT_SKILLS]: 'List skills mentioned in each project',
  [COMMANDS.SKILL_SEARCH]:
    "Search for the mention of a skill. ex: 'search react'",
  [COMMANDS.DESCRIBE_PROJECT]:
    "gets the project description for a given project name. If no project is provided this website will be described. ex: 'describe projectName' | 'describe'",
};

export const HighlightedSpan: FC<{ value: string }> = ({ value }) => (
  <Typography component="span" sx={{ color: 'info.main' }}>
    {value}
  </Typography>
);

/**
 * tag function to create a Typography component with highlighted values
 * #### EXAMPLE:
 ```
commandOutputTagFunction`Type ${COMMAND.LIST_SKILLS} to view a list of all my skills.`;
 ```
 * #### RETURNS:
 ```
<Typography>
    Type <Typography color="success">list skills</Typography> to view a list of all my skills.
</Typography>
 ```
 * */
export const commandOutputTagFunction = (
  strings: TemplateStringsArray,
  ...values: string[]
) => {
  return (
    <Typography paragraph>
      {strings.map((string, index) => {
        // get the value if it exists
        const value = values.length > index ? values[index] : undefined;
        return (
          <React.Fragment key={`string-and-value-${string}-${value}-${index}`}>
            {string} {value !== undefined && <HighlightedSpan value={value} />}
          </React.Fragment>
        );
      })}
    </Typography>
  );
};

export const normalizeCommand = (command: string) => {
  return command.toLowerCase().trim();
};

const normalizeSkill = (skill: string): string => {
  // replace all _ or - with a space
  return skill.replace(/[_-]/g, ' ').toLowerCase().trim();
};

const isValidSkill = (normalizedSkill: string): boolean => {
  if (
    normalizedSkill === OUTDATED_PROJECT ||
    normalizedSkill === MAIN_PROJECT ||
    !normalizedSkill
  ) {
    return false;
  }
  return true;
};

const normalizeSkillWithConsistentName = (topic: string): string => {
  const normalizedTopic = normalizeSkill(topic)
    .split(' ')
    .map(getConsistentSkillName)
    .join(' ');
  return getConsistentSkillName(normalizedTopic);
};

export const getProjectSkills = (projects: IProject[]) => {
  return projects.map((project) => {
    const normalizedLanguages = project.languages.map(
      normalizeSkillWithConsistentName
    );
    const normalizedTopics = project.topics.map(
      normalizeSkillWithConsistentName
    );
    const skillSet = getUniqueArrayEntries(
      normalizedLanguages.concat(normalizedTopics).filter(isValidSkill),
      (skill, uniqueSkillSet) => {
        const alreadyExistingSkill = skill
          .split(' ')
          .find((skillPart) => uniqueSkillSet.has(skillPart));
        if (alreadyExistingSkill) {
          // value is not unique
          return [false, alreadyExistingSkill];
        }
        // value is unique
        return true;
      },
      // set to false to keep the last value
      false
    );
    return {
      projectName: project.name,
      skillSet,
    };
  });
};

export const WELCOME_MESSAGE: JSX.Element = commandOutputTagFunction`Welcome to the Skills Terminal! To view a list of all my skills type ${COMMANDS.LIST_SKILLS}. To view all the available commands enter ${COMMANDS.HELP}.`;

export const getConsistentSkillName = (skill: string): string => {
  const lowerCaseSkill = skill.toLowerCase().trim();
  for (const [consistentSkillName, skillVariety] of Object.entries(
    SKILLS_VARIETY
  )) {
    if (skillVariety.has(lowerCaseSkill)) {
      return consistentSkillName.toLowerCase();
    }
  }
  return skill.toLowerCase();
};
