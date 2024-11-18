import Grid from '@mui/material/Grid';
import React, { FC } from 'react';
import useProjects from '../hooks/useProjects';
import SectionWrapper from '../section/SectionWrapper';
import { ResumeRole } from '../types/resume';
import ProjectCard from './ProjectCard';

interface ProjectsProps {
  role?: ResumeRole;
}
const Projects: FC<ProjectsProps> = (props) => {
  const { projects, loading, error } = useProjects(props.role);
  return (
    <SectionWrapper title="Projects" loading={loading} error={error}>
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        {projects.map((project) => (
          <Grid item key={project.id} xs={12} sm={6} md={4} lg={3}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>
    </SectionWrapper>
  );
};

export default Projects;
