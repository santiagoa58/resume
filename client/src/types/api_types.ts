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
  // list of personal projects
  personal_projects: IResumePersonalProject[];
}
