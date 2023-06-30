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
  name?: string | null;
  avatar_url: string;
  gravatar_id?: string | null;
  html_url: string;
  type: string;
}

export interface IProject {
  id: number;
  name: string;
  full_name: string;
  owner: IProjectUser;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  languages_url: string;
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
  topics: string[];
  archived: boolean;
  disabled: boolean;
  visibility: string;
  pushed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  subscribers_count?: number;
  forks: number;
  open_issues: number;
  watchers: number;
  languages: string[];
}
