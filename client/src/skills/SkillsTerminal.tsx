import React, { FC, useState, useEffect, useMemo, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useProjectsState } from '../hooks/useProjects';
import { IProject } from '../types/api_types';
import {
  COMMANDS,
  COMMANDS_DESCRIPTION,
  HighlightedSpan,
  WELCOME_MESSAGE,
  commandOutputTagFunction,
  getConsistentSkillName,
  getProjectSkills,
  normalizeCommand,
} from './skillsUtils';
import { findNormalizedValue } from '../utils/objectUtils';
import { MAIN_PROJECT } from '../utils/constants';

interface ISkillsTerminalProps {
  skills: string[];
}
interface ProjectSkillsOutputProps {
  projects: IProject[];
}

const initialOutputs: Array<JSX.Element> = [WELCOME_MESSAGE];

// COMPONENTS
const SkillsTerminalOutputWrapper: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Box display="block" sx={{ marginBottom: '1rem' }}>
      {children}
    </Box>
  );
};

const HelpCommandOutput: FC = () => {
  return (
    <SkillsTerminalOutputWrapper>
      {Object.entries(COMMANDS_DESCRIPTION).map(([command, description]) => (
        <Box display="block" key={command}>
          <HighlightedSpan value={command} /> - {description}
        </Box>
      ))}
    </SkillsTerminalOutputWrapper>
  );
};

const SkillsTerminalOutput: FC<{ values: string[] }> = ({ values }) => {
  return (
    <SkillsTerminalOutputWrapper>
      {values.map((value) => (
        <Box component="span" display="block" key={value}>
          {value}
        </Box>
      ))}
    </SkillsTerminalOutputWrapper>
  );
};

const ProjectSkillsOutput: FC<ProjectSkillsOutputProps> = (props) => {
  const projectSkills = useMemo(
    () => getProjectSkills(props.projects),
    [props.projects]
  );
  return (
    <SkillsTerminalOutputWrapper>
      {projectSkills.map((projectSkill) => (
        <Box key={projectSkill.projectName}>
          <Typography color="info.main">{projectSkill.projectName}</Typography>
          <List dense>
            {projectSkill.skillSet.map((skill) => (
              <ListItem key={skill} sx={{ mt: 0, mb: 0, pt: 0, pb: 0 }}>
                <ListItemText
                  primary={skill}
                  sx={{ textTransform: 'uppercase' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </SkillsTerminalOutputWrapper>
  );
};

const ProjectDescriptionOutput: FC<{
  command: string;
  projects: IProject[];
}> = ({ command, projects }) => {
  const projectName = command.replace(COMMANDS.DESCRIBE_PROJECT, '').trim();
  let project = findNormalizedValue(projects, projectName, (proj) => proj.name);
  if (!project) {
    // if no project found, try to find the main project
    project = projects.find((proj) => proj.topics.includes(MAIN_PROJECT));
  }
  if (!project) {
    return null;
  }
  return (
    <SkillsTerminalOutputWrapper>
      <Typography color="info.main">{project.name}</Typography>
      <Typography>{project.description}</Typography>
    </SkillsTerminalOutputWrapper>
  );
};

const ProjectSkillsSearchOutput: FC<{
  skill: string;
  projects: IProject[];
  notFoundMessage?: JSX.Element;
}> = ({ skill, projects, notFoundMessage }) => {
  const projectsWithSkill = getProjectsWithSkill(projects, skill).map(
    ({ projectName }) => projectName
  );
  if (projectsWithSkill.length === 0) {
    return (
      notFoundMessage ??
      commandOutputTagFunction`No projects found with skill ${skill}`
    );
  }
  return <SkillsTerminalOutput values={projectsWithSkill} />;
};

const SkillsSearchOutput: FC<{
  command: string;
  skills: string[];
  projects: IProject[];
}> = ({ command, skills, projects }) => {
  const skill = command.replace(COMMANDS.SKILL_SEARCH, '').trim();
  const isSkillInProject = getProjectsWithSkill(projects, skill).length > 0;
  if (isSkillInProject) {
    return (
      <>
        {commandOutputTagFunction`These projects mention the skill ${skill}`}
        <ProjectSkillsSearchOutput skill={skill} projects={projects} />
      </>
    );
  }
  const filteredSkills = skills
    .map(getConsistentSkillName)
    .filter((skillName) =>
      getConsistentSkillName(skillName).includes(getConsistentSkillName(skill))
    );
  if (filteredSkills.length === 0) {
    return commandOutputTagFunction`I don't seem to have the skill ${skill} yet`;
  }

  return commandOutputTagFunction`I have the skill ${skill} but no project seems to explicitly mention it`;
};

// END COMPONENTS

const getProjectsWithSkill = (projects: IProject[], skill: string) => {
  return getProjectSkills(projects).filter((project) =>
    project.skillSet.includes(getConsistentSkillName(skill))
  );
};

// STATE MANAGEMENT
const getOutputsState = (
  state: Array<JSX.Element>,
  command: string,
  skills: string[],
  projects: IProject[]
): Array<JSX.Element> => {
  const normalizedCommand = normalizeCommand(command);
  if (normalizedCommand.startsWith(COMMANDS.DESCRIBE_PROJECT)) {
    const projectDescription = (
      <ProjectDescriptionOutput
        command={normalizedCommand}
        projects={projects}
      />
    );
    if (projectDescription) {
      return state.concat(projectDescription);
    }
    return state;
  }
  if (normalizedCommand.startsWith(COMMANDS.SKILL_SEARCH)) {
    return state.concat(
      <SkillsSearchOutput
        command={normalizedCommand}
        skills={skills}
        projects={projects}
      />
    );
  }
  switch (normalizedCommand) {
    case COMMANDS.LIST_SKILLS:
      return state.concat(<SkillsTerminalOutput values={skills} />);
    case COMMANDS.HELP:
      return state.concat(<HelpCommandOutput />);
    case COMMANDS.CLEAR:
      return initialOutputs;
    case COMMANDS.LIST_PROJECT_SKILLS:
      return state.concat(<ProjectSkillsOutput projects={projects} />);
    case COMMANDS.LIST_PROJECTS:
      return state.concat(
        <SkillsTerminalOutput
          values={projects.map((project) => project.name).sort()}
        />
      );
    default:
      return state.concat(
        commandOutputTagFunction`Command not recognized. Type ${COMMANDS.HELP} to view all available commands`
      );
  }
};
// END STATE MANAGEMENT

const SkillsTerminal: FC<ISkillsTerminalProps> = (props) => {
  const [command, setCommand] = useState('');
  const [outputs, setOutputs] = useState<Array<JSX.Element>>(initialOutputs);
  const [projects] = useProjectsState();
  const outputSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (outputSectionRef.current) {
      outputSectionRef.current.scrollTop =
        outputSectionRef.current.scrollHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outputs]);

  const handleCommand: React.FormEventHandler = (event) => {
    event.preventDefault();
    setOutputs((prevOutputs) =>
      getOutputsState(prevOutputs, command, props.skills, projects)
    );
    setCommand('');
  };

  return (
    <Paper
      component="form"
      onSubmit={handleCommand}
      sx={{
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        marginBottom={outputs.length ? '2em' : undefined}
        overflow="auto"
        height="50vh"
        ref={outputSectionRef}
      >
        {outputs.map((output, index) => (
          <React.Fragment key={`output-${index}`}>{output}</React.Fragment>
        ))}
      </Box>
      <TextField
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        variant="standard"
        placeholder={'Enter command'}
        fullWidth
      />
    </Paper>
  );
};

export default SkillsTerminal;
