import React, { FC } from 'react';
import useProjects from '../hooks/useProjects';
import SectionWrapper from '../section/SectionWrapper';
import Card, { CardProps } from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { IProject } from '../types/api_types';

interface IProjectCardProps extends CardProps {
  project: IProject;
}

const ProjectCard: FC<IProjectCardProps> = ({ project, ...props }) => {
  return (
    <Card sx={{ maxWidth: 345 }} {...props}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {project.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {project.description}
        </Typography>
        <Typography>{project.languages.join(', ')}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small">{project.homepage}</Button>
        <Button size="small">{project.html_url}</Button>
      </CardActions>
    </Card>
  );
};

const Projects: FC = () => {
  const { projects, loading, error } = useProjects();
  return (
    <SectionWrapper title="Projects" loading={loading} error={error}>
      <Grid container spacing={2}>
        <Grid item>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </Grid>
      </Grid>
    </SectionWrapper>
  );
};

export default Projects;
