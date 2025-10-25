import { IResume, IProject } from '../../types/api_types';

/**
 * Creates a knowledge base string from resume and project data
 * This will be used as context for the AI chatbot
 */
export const createKnowledgeBase = (
  resume: IResume | undefined,
  projects: IProject[]
): string => {
  if (!resume) {
    return 'No resume data available yet.';
  }

  const sections: string[] = [];

  // Personal Info
  sections.push(`# About ${resume.name}`);
  sections.push(`Title: ${resume.title}`);
  if (resume.location) sections.push(`Location: ${resume.location}`);
  if (resume.email) sections.push(`Email: ${resume.email}`);
  sections.push('');

  // Summary
  if (resume.summary) {
    sections.push('## Professional Summary');
    sections.push(resume.summary);
    sections.push('');
  }

  // Skills
  if (resume.skills.length > 0) {
    sections.push('## Skills');
    sections.push(resume.skills.join(', '));
    sections.push('');
  }

  // Work Experience
  if (resume.experiences.length > 0) {
    sections.push('## Work Experience');
    resume.experiences.forEach((exp) => {
      sections.push(`### ${exp.role} at ${exp.company}`);
      sections.push(`Location: ${exp.location}`);
      sections.push(`Duration: ${exp.duration}`);
      sections.push('Responsibilities:');
      exp.responsibilities.forEach((resp) => {
        sections.push(`- ${resp}`);
      });
      sections.push('');
    });
  }

  // Education
  if (resume.educations.length > 0) {
    sections.push('## Education');
    resume.educations.forEach((edu) => {
      sections.push(
        `- ${edu.degree} from ${edu.institution} (${edu.duration})`
      );
    });
    sections.push('');
  }

  // Personal Projects from Resume
  if (resume.personal_projects.length > 0) {
    sections.push('## Personal Projects (from resume)');
    resume.personal_projects.forEach((proj) => {
      sections.push(`### ${proj.name}`);
      sections.push(proj.description);
      sections.push('');
    });
  }

  // GitHub Projects
  if (projects.length > 0) {
    sections.push('## GitHub Projects');
    projects.forEach((proj) => {
      if (proj.description) {
        sections.push(`### ${proj.name}`);
        sections.push(`Description: ${proj.description}`);
        if (proj.languages.length > 0) {
          sections.push(`Technologies: ${proj.languages.join(', ')}`);
        }
        if (proj.topics.length > 0) {
          sections.push(`Topics: ${proj.topics.join(', ')}`);
        }
        sections.push(
          `Stars: ${proj.stargazers_count}, Forks: ${proj.forks_count}`
        );
        sections.push(`URL: ${proj.html_url}`);
        sections.push('');
      }
    });
  }

  return sections.join('\n');
};

/**
 * Extract relevant context from knowledge base based on user question
 * Simple keyword-based relevance for now
 */
export const extractRelevantContext = (
  knowledgeBase: string,
  question: string
): string => {
  const questionLower = question.toLowerCase();

  // Keywords that indicate what the user is asking about
  const keywords = questionLower.split(/\s+/).filter((word) => word.length > 3); // Filter out small words

  // Score each section based on keyword matches
  const sections = knowledgeBase.split(/\n##\s/);
  const scoredSections = sections.map((section) => {
    const sectionLower = section.toLowerCase();
    const score = keywords.reduce((acc, keyword) => {
      const matches = (sectionLower.match(new RegExp(keyword, 'g')) || [])
        .length;
      return acc + matches;
    }, 0);
    return { section, score };
  });

  // Sort by relevance and take top sections
  const relevantSections = scoredSections
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3) // Top 3 most relevant sections
    .map((s) => s.section);

  if (relevantSections.length === 0) {
    // If no relevant sections found, return a summary
    return sections.slice(0, 2).join('\n## '); // Return first 2 sections (usually About and Summary)
  }

  return relevantSections.join('\n## ');
};
