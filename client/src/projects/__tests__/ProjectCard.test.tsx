// test ProjectCard component
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProjectCard from '../ProjectCard';
import { IProject } from '../../types/api_types';
import { mockProject } from '../../test_utils/apiMocks';

describe('ProjectCard', () => {
  const project: IProject = {
    ...mockProject,
    name: 'Project Name',
    description: 'test description',
    html_url: 'https://github.com/user/repo',
    homepage: 'https://ProjectCard.com',
    languages: ['ruby', 'python', 'javascript', 'HTML'],
    topics: ['topic1', 'topic2', 'topic3'],
  };
  it('renders ProjectCard component', () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByText(project.name)).toBeInTheDocument();
    // description is rendered
    expect(screen.getByText(project.description!)).toBeInTheDocument();
    // languages are rendered
    expect(
      screen.getByText(`Languages: ${project.languages.join(', ')}`)
    ).toBeInTheDocument();
    // source code link component is rendered
    const sourceCodeLink = screen.getByLabelText('source code');
    expect(sourceCodeLink).toBeInTheDocument();
    expect(sourceCodeLink).toHaveAttribute('href', project.html_url);
    // website link component is rendered
    const websiteLink = screen.getByLabelText('website');
    expect(websiteLink).toBeInTheDocument();
    expect(websiteLink).toHaveAttribute('href', project.homepage!);
  });
  it('does not render website link component if homepage is null', () => {
    render(<ProjectCard project={{ ...project, homepage: '' }} />);
    expect(screen.queryByLabelText('website')).toBeNull();
  });
  it('renders project topics', () => {
    render(<ProjectCard project={project} />);
    // check that each topic is rendered
    project.topics.forEach((topic) => {
      expect(screen.getByText(topic)).toBeInTheDocument();
    });
  });
});
