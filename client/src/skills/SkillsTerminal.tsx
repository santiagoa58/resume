import React, { FC, useState, useEffect, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

interface ISkillsTerminalProps {
  skills: string[];
}

enum COMMANDS {
  LIST_SKILLS = 'list skills',
  HELP = 'help',
  CLEAR = 'clear',
}

// map of all commands as key and descriptions as value
const COMMANDS_DESCRIPTION: Record<COMMANDS, string> = {
  [COMMANDS.LIST_SKILLS]: 'List all my skills',
  [COMMANDS.HELP]: 'List all available commands',
  [COMMANDS.CLEAR]: 'Clear the terminal',
};

const HighlightedSpan: FC<{ value: string }> = ({ value }) => (
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
const commandOutputTagFunction = (
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

const WELCOME_MESSAGE: JSX.Element = commandOutputTagFunction`Welcome to the Skills Terminal! To view a list of all my skills type ${COMMANDS.LIST_SKILLS}. To view all the available commands enter ${COMMANDS.HELP}.`;

const normalizeCommand = (command: string) => {
  return command.toLowerCase().trim();
};

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

const SkillsTerminalOutput: FC<{ skills: string[] }> = ({ skills }) => {
  return (
    <SkillsTerminalOutputWrapper>
      {skills.map((skill) => (
        <Box component="span" display="block" key={skill}>
          {skill}
        </Box>
      ))}
    </SkillsTerminalOutputWrapper>
  );
};

const initialOutputs: Array<JSX.Element> = [WELCOME_MESSAGE];

const getOutputsState = (
  state: Array<JSX.Element>,
  command: string,
  skills: string[]
): Array<JSX.Element> => {
  const normalizedCommand = normalizeCommand(command);
  switch (normalizedCommand) {
    case COMMANDS.LIST_SKILLS:
      return state.concat(<SkillsTerminalOutput skills={skills} />);
    case COMMANDS.HELP:
      return state.concat(<HelpCommandOutput />);
    case COMMANDS.CLEAR:
      return initialOutputs;
    default:
      return state.concat(
        commandOutputTagFunction`Command not recognized. Type ${COMMANDS.HELP} to view all available commands`
      );
  }
};

const SkillsTerminal: FC<ISkillsTerminalProps> = (props) => {
  const [command, setCommand] = useState('');
  const [outputs, setOutputs] = useState<Array<JSX.Element>>(initialOutputs);
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
      getOutputsState(prevOutputs, command, props.skills)
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
