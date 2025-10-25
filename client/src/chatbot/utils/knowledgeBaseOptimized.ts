import { IResume, IProject } from '../../types/api_types';

// Stop words to filter out
const STOP_WORDS = new Set([
  'the',
  'and',
  'or',
  'but',
  'in',
  'on',
  'at',
  'to',
  'for',
  'of',
  'with',
  'by',
  'from',
  'as',
  'is',
  'was',
  'are',
  'were',
  'been',
  'be',
  'have',
  'has',
  'had',
  'do',
  'does',
  'did',
  'will',
  'would',
  'should',
  'could',
  'can',
  'may',
  'might',
  'must',
  'what',
  'when',
  'where',
  'which',
  'who',
  'how',
  'why',
  'this',
  'that',
  'these',
  'those',
]);

/**
 * Creates knowledge base (same as before)
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
 * Extract keywords from question (optimized)
 */
const extractKeywords = (question: string): string[] => {
  const questionLower = question.toLowerCase();

  // Remove punctuation and split
  const words = questionLower
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

  // Deduplicate
  return Array.from(new Set(words));
};

/**
 * Score a section based on keyword matches (OPTIMIZED - no RegExp in loop!)
 */
const scoreSection = (section: string, keywords: string[]): number => {
  const sectionLower = section.toLowerCase();
  let score = 0;

  // Use indexOf instead of creating RegExp objects
  for (const keyword of keywords) {
    let pos = 0;
    while ((pos = sectionLower.indexOf(keyword, pos)) !== -1) {
      score++;
      pos += keyword.length;
    }
  }

  // Bonus for keywords in headers
  const headerMatch = section.match(/^##?\s+(.+)$/m);
  if (headerMatch) {
    const headerLower = headerMatch[1].toLowerCase();
    for (const keyword of keywords) {
      if (headerLower.includes(keyword)) {
        score += 3; // Extra weight for header matches
      }
    }
  }

  return score;
};

/**
 * Extract relevant context - OPTIMIZED VERSION
 * Fixed: Catastrophic O(n*m*k) performance issue
 * Now: O(n*m) with simple string operations, no RegExp creation
 */
export const extractRelevantContext = (
  knowledgeBase: string,
  question: string
): string => {
  // Extract and clean keywords
  const keywords = extractKeywords(question);

  if (keywords.length === 0) {
    // No valid keywords, return summary sections
    const sections = knowledgeBase.split(/\n##\s/);
    return sections.slice(0, 2).join('\n## ');
  }

  // Split into sections
  const sections = knowledgeBase.split(/\n##\s/);

  // Score each section (optimized - no RegExp creation!)
  const scoredSections = sections.map((section) => ({
    section,
    score: scoreSection(section, keywords),
  }));

  // Sort by score and take top 3
  const relevantSections = scoredSections
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.section);

  if (relevantSections.length === 0) {
    // No matches, return default sections
    return sections.slice(0, 2).join('\n## ');
  }

  // Join sections back
  return relevantSections.join('\n## ');
};

/**
 * Get knowledge base statistics
 */
export const getKnowledgeBaseStats = (
  kb: string
): {
  totalCharacters: number;
  estimatedTokens: number;
  sectionCount: number;
} => {
  return {
    totalCharacters: kb.length,
    estimatedTokens: Math.ceil(kb.length / 4), // Rough estimate
    sectionCount: (kb.match(/\n##\s/g) || []).length,
  };
};
