import React from 'react';
import Card, { CardProps } from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Code from '@mui/icons-material/Code';
import LanguageIcon from '@mui/icons-material/Language';
import { IProject } from '../types/api_types';
import Box from '@mui/material/Box';
import { Chip } from '@mui/material';
import { MAIN_PROJECT } from '../utils/constants';

interface ProjectCardProps extends CardProps {
  project: IProject;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, sx, ...props }) => {
  const isMain = project.topics.includes(MAIN_PROJECT);
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        ...sx,
      }}
      {...props}
    >
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          color={isMain ? 'secondary' : 'text.primary'}
        >
          {project.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {project.description}
        </Typography>
        <Typography mt="1rem" variant="body2" color="text.secondary">
          Languages: {project.languages.join(', ')}
        </Typography>
        <Box mt="1rem" display="flex" flexWrap="wrap">
          {project.topics.map((topic, index) => (
            <Chip
              label={topic}
              color="secondary"
              variant="outlined"
              size="small"
              sx={{ mr: '0.5rem', mb: '0.5rem' }}
              key={index}
            />
          ))}
        </Box>
      </CardContent>
      <CardActions>
        <IconButton
          aria-label="source code"
          component="a"
          color="primary"
          href={project.html_url}
          target="_blank"
        >
          <Code />
        </IconButton>
        {project.homepage && (
          <IconButton
            aria-label="website"
            component="a"
            color="primary"
            href={project.homepage}
            target="_blank"
          >
            <LanguageIcon />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
