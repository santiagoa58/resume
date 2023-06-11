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
  node_id: 'MDEwOlJlcG9zaXRvcnkzODUyNTc3NjA=',
  name: 'simple-go-server',
  full_name: 'username/simple-go-server',
  private: false,
  owner: {
    login: 'username',
    id: 123567,
    node_id: 'MMMDDDadsf3Msxds',
    avatar_url: 'https://avatars.githubusercontent.com/u/123567?v=4',
    gravatar_id: '',
    url: 'https://api.github.com/users/username',
    html_url: 'https://github.com/username',
    followers_url: 'https://api.github.com/users/username/followers',
    following_url:
      'https://api.github.com/users/username/following{/other_user}',
    gists_url: 'https://api.github.com/users/username/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/username/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/username/subscriptions',
    organizations_url: 'https://api.github.com/users/username/orgs',
    repos_url: 'https://api.github.com/users/username/repos',
    events_url: 'https://api.github.com/users/username/events{/privacy}',
    received_events_url:
      'https://api.github.com/users/username/received_events',
    type: 'User',
    site_admin: false,
  },
  html_url: 'https://github.com/username/simple-go-server',
  description:
    'simple server written in go. made as a part of the golang.org Writing Web Applications tutorial',
  fork: false,
  url: 'https://api.github.com/repos/username/simple-go-server',
  forks_url: 'https://api.github.com/repos/username/simple-go-server/forks',
  keys_url:
    'https://api.github.com/repos/username/simple-go-server/keys{/key_id}',
  collaborators_url:
    'https://api.github.com/repos/username/simple-go-server/collaborators{/collaborator}',
  teams_url: 'https://api.github.com/repos/username/simple-go-server/teams',
  hooks_url: 'https://api.github.com/repos/username/simple-go-server/hooks',
  issue_events_url:
    'https://api.github.com/repos/username/simple-go-server/issues/events{/number}',
  events_url: 'https://api.github.com/repos/username/simple-go-server/events',
  assignees_url:
    'https://api.github.com/repos/username/simple-go-server/assignees{/user}',
  branches_url:
    'https://api.github.com/repos/username/simple-go-server/branches{/branch}',
  tags_url: 'https://api.github.com/repos/username/simple-go-server/tags',
  blobs_url:
    'https://api.github.com/repos/username/simple-go-server/git/blobs{/sha}',
  git_tags_url:
    'https://api.github.com/repos/username/simple-go-server/git/tags{/sha}',
  git_refs_url:
    'https://api.github.com/repos/username/simple-go-server/git/refs{/sha}',
  trees_url:
    'https://api.github.com/repos/username/simple-go-server/git/trees{/sha}',
  statuses_url:
    'https://api.github.com/repos/username/simple-go-server/statuses/{sha}',
  languages_url:
    'https://api.github.com/repos/username/simple-go-server/languages',
  stargazers_url:
    'https://api.github.com/repos/username/simple-go-server/stargazers',
  contributors_url:
    'https://api.github.com/repos/username/simple-go-server/contributors',
  subscribers_url:
    'https://api.github.com/repos/username/simple-go-server/subscribers',
  subscription_url:
    'https://api.github.com/repos/username/simple-go-server/subscription',
  commits_url:
    'https://api.github.com/repos/username/simple-go-server/commits{/sha}',
  git_commits_url:
    'https://api.github.com/repos/username/simple-go-server/git/commits{/sha}',
  comments_url:
    'https://api.github.com/repos/username/simple-go-server/comments{/number}',
  issue_comment_url:
    'https://api.github.com/repos/username/simple-go-server/issues/comments{/number}',
  contents_url:
    'https://api.github.com/repos/username/simple-go-server/contents/{+path}',
  compare_url:
    'https://api.github.com/repos/username/simple-go-server/compare/{base}...{head}',
  merges_url: 'https://api.github.com/repos/username/simple-go-server/merges',
  archive_url:
    'https://api.github.com/repos/username/simple-go-server/{archive_format}{/ref}',
  downloads_url:
    'https://api.github.com/repos/username/simple-go-server/downloads',
  issues_url:
    'https://api.github.com/repos/username/simple-go-server/issues{/number}',
  pulls_url:
    'https://api.github.com/repos/username/simple-go-server/pulls{/number}',
  milestones_url:
    'https://api.github.com/repos/username/simple-go-server/milestones{/number}',
  notifications_url:
    'https://api.github.com/repos/username/simple-go-server/notifications{?since,all,participating}',
  labels_url:
    'https://api.github.com/repos/username/simple-go-server/labels{/name}',
  releases_url:
    'https://api.github.com/repos/username/simple-go-server/releases{/id}',
  deployments_url:
    'https://api.github.com/repos/username/simple-go-server/deployments',
  created_at: '2019-07-12T13:30:09Z',
  updated_at: '2021-06-10T18:23:16Z',
  pushed_at: '2019-07-12T14:06:29Z',
  git_url: 'git://github.com/username/simple-go-server.git',
  ssh_url: 'git@github.com:username/simple-go-server.git',
  clone_url: 'https://github.com/username/simple-go-server.git',
  svn_url: 'https://github.com/username/simple-go-server',
  homepage: '',
  size: 2,
  stargazers_count: 0,
  watchers_count: 0,
  language: 'Go',
  has_issues: true,
  has_projects: true,
  has_downloads: true,
  has_wiki: true,
  has_pages: false,
  has_discussions: false,
  forks_count: 0,
  mirror_url: null,
  archived: false,
  disabled: false,
  open_issues_count: 0,
  license: null,
  allow_forking: true,
  is_template: false,
  web_commit_signoff_required: false,
  topics: [],
  visibility: 'public',
  forks: 0,
  open_issues: 0,
  watchers: 0,
  default_branch: 'master',
  permissions: {
    admin: true,
    maintain: true,
    push: true,
    triage: true,
    pull: true,
  },
  languages: ['Go', 'HTML', 'Dockerfile'],
};
