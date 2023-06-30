import {
  IResume,
  IResumeExperience,
  IResumeEducation,
  IProject,
} from '../types/api_types';

export const mockResumeExperience: IResumeExperience = {
  company: 'Apple',
  duration: 'JUNE 2014 - PRESENT',
  location: 'BOSTON, MA',
  responsibilities: ['iphone and mac stuff'],
  role: 'iPhone Engineer',
};

export const mockResumeEducation: IResumeEducation = {
  degree: "Master's in Business Administration",
  duration: 'MAY 2008 - MAY 2012',
  institution: 'Harvard',
};

export const mockResume: IResume = {
  doc_id: 'abc123',
  doc_name: 'resume file',
  name: 'firstname lastname',
  contacts: [
    'name@email.com',
    'linkedin.com/in/first-last',
    'github.com/user',
    'instagram.com/user',
  ],
  location: 'London, UK',
  title: 'Software Engineer',
  summary: 'test summary',
  skills: ['nodejs', 'python', 'c++', 'docker'],
  experiences: [mockResumeExperience],
  educations: [mockResumeEducation],
  personal_projects: [
    { description: 'some project', name: 'personal project' },
  ],
};

export const mockProject: IProject = {
  id: 212123,
  name: 'simple-go-server',
  full_name: 'username/simple-go-server',
  private: false,
  owner: {
    name: 'username',
    avatar_url: 'https://avatars.githubusercontent.com/u/123567?v=4',
    gravatar_id: '',
    html_url: 'https://github.com/username',
    type: 'User',
  },
  html_url: 'https://github.com/username/simple-go-server',
  description:
    'simple server written in go. made as a part of the golang.org Writing Web Applications tutorial',
  fork: false,
  url: 'https://api.github.com/repos/username/simple-go-server',
  languages_url:
    'https://api.github.com/repos/username/simple-go-server/languages',
  created_at: '2019-07-12T13:30:09Z',
  updated_at: '2021-06-10T18:23:16Z',
  pushed_at: '2019-07-12T14:06:29Z',
  homepage: '',
  size: 2,
  stargazers_count: 0,
  watchers_count: 0,
  language: 'Go',
  forks_count: 0,
  archived: false,
  disabled: false,
  topics: [],
  visibility: 'public',
  forks: 0,
  open_issues: 0,
  watchers: 0,
  default_branch: 'master',
  languages: ['Go', 'HTML', 'Dockerfile'],
};
