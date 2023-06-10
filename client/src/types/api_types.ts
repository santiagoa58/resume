/**
 * RESUME API TYPES
 */

// resume metadata
export interface IResumeMetadata {
  // resume file name
  name: string;
  // resume file id
  id: string;
}

// resume work experience
export interface IResumeExperience {
  // name of the company
  company: string;
  // location of the company
  location: string;
  // duration of the work experience
  duration: string;
  // role of the resume author
  role: string;
  // list of responsibilities
  responsibilities: string[];
}

// resume education
export interface IResumeEducation {
  // degree obtained by the resume author
  degree: string;
  // institution where the resume author obtained their degree
  institution: string;
  // duration of the education
  duration: string;
}

// resume personal project
export interface IResumePersonalProject {
  // name of the personal project
  name: string;
  // description of the personal project
  description: string;
}

// Resume details
export interface IResume {
  // id of the resume
  doc_id: string;
  // name of the resume
  doc_name: string;
  // name of the resume author
  name: string;
  // list of contact information for the resume author
  contacts: string[];
  // location of the resume author
  location: string;
  // professional title of the resume author
  title: string;
  // summary section of the resume
  summary: string;
  // list of skills
  skills: string[];
  // list of work experience
  experiences: IResumeExperience[];
  // education section of the resume
  educations: IResumeEducation[];
  // list of personal projects mentioned in the resume
  personal_projects: IResumePersonalProject[];
}

/**
 * PROJECTS API TYPES
 */

// A GitHub user.
interface IProjectUser {
  name: string | null;
  email: string | null;
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  starred_at: string;
}

interface IProjectCodeOfConduct {
  key: string;
  name: string;
  url: string;
  body: string;
  html_url: string | null;
}

type SecurityStatus = {
  status: 'enabled' | 'disabled';
};

interface IProjectSecurityAndAnalysis {
  advanced_security?: SecurityStatus;
  secret_scanning?: SecurityStatus;
  secret_scanning_push_protection?: SecurityStatus;
}

interface IProjectPermissions {
  admin: boolean;
  maintain: boolean;
  push: boolean;
  triage: boolean;
  pull: boolean;
}

interface ProjectLicense {
  key: string;
  name: string;
  spdx_id: string;
  url: string;
  node_id: string;
}

export interface IProject {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  owner: IProjectUser;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  archive_url: string;
  assignees_url: string;
  blobs_url: string;
  branches_url: string;
  collaborators_url: string;
  comments_url: string;
  commits_url: string;
  compare_url: string;
  contents_url: string;
  contributors_url: string;
  deployments_url: string;
  downloads_url: string;
  events_url: string;
  forks_url: string;
  git_commits_url: string;
  git_refs_url: string;
  git_tags_url: string;
  git_url: string;
  issue_comment_url: string;
  issue_events_url: string;
  issues_url: string;
  keys_url: string;
  labels_url: string;
  languages_url: string;
  merges_url: string;
  milestones_url: string;
  notifications_url: string;
  pulls_url: string;
  releases_url: string;
  ssh_url: string;
  stargazers_url: string;
  statuses_url: string;
  subscribers_url: string;
  subscription_url: string;
  tags_url: string;
  teams_url: string;
  trees_url: string;
  clone_url: string;
  mirror_url: string | null;
  hooks_url: string;
  svn_url: string;
  homepage: string | null;
  language: string | null;
  forks_count: number;
  stargazers_count: number;
  watchers_count: number;
  /**
   * The size of the repository. Size is calculated hourly. When a repository is initially created, the size is 0.
   */
  size: number;
  default_branch: string;
  open_issues_count: number;
  is_template: boolean;
  topics: string[];
  has_issues: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_downloads: boolean;
  has_discussions: boolean;
  archived: boolean;
  disabled: boolean;
  visibility: string;
  pushed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  permissions: IProjectPermissions;
  role_name: string;
  temp_clone_token: string;
  delete_branch_on_merge: boolean;
  subscribers_count: number;
  network_count: number;
  code_of_conduct: IProjectCodeOfConduct;
  license: ProjectLicense | null;
  forks: number;
  open_issues: number;
  watchers: number;
  allow_forking: boolean;
  web_commit_signoff_required: boolean;
  security_and_analysis: IProjectSecurityAndAnalysis | null;
  languages: string[];
}
