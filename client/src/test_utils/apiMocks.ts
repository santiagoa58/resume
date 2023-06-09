import {
  IResume,
  IResumeExperience,
  IResumeEducation,
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
