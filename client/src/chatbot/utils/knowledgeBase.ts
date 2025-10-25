import { IResume, IProject } from '../../types/api_types';

/**
 * Creates a knowledge base string from resume and project data
 * This will be used as context for the AI chatbot
 *
 * TODO: [HIGH] Add memoization to prevent regenerating on every render
 * Currently regenerates entire knowledge base whenever projects array changes reference
 *
 * TODO: [MEDIUM] Add structured output format (JSON or YAML) for better parsing
 * Current markdown format is hard for model to parse accurately
 *
 * TODO: [MEDIUM] Implement chunking strategy for large knowledge bases
 * Need to handle cases where total content exceeds token limits
 *
 * TODO: [LOW] Add knowledge base versioning for cache invalidation
 */
export const createKnowledgeBase = (
  resume: IResume | undefined,
  projects: IProject[]
): string => {
  if (!resume) {
    return 'No resume data available yet.';
    // TODO: [LOW] Consider returning structured empty state instead of string
  }

  const sections: string[] = [];

  // TODO: [LOW] Add metadata section with last updated timestamp, resume version, etc.

  // Personal Info
  sections.push(`# About ${resume.name}`);
  sections.push(`Title: ${resume.title}`);
  if (resume.location) sections.push(`Location: ${resume.location}`);
  if (resume.email) sections.push(`Email: ${resume.email}`);
  // TODO: [MEDIUM] SECURITY: Consider redacting or obfuscating email/PII
  // Decide what should be public vs. what chatbot should know but not reveal
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
    // TODO: [MEDIUM] Group skills by category (Languages, Frameworks, Tools, etc.)
    // TODO: [LOW] Add skill proficiency levels if available
    // TODO: [LOW] Add skill relationships (e.g., "React" relates to "JavaScript", "TypeScript")
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
      // TODO: [LOW] Add extracted skills/technologies from responsibilities
      // TODO: [LOW] Add impact metrics (if mentioned in responsibilities)
      // TODO: [LOW] Add project links if mentioned in responsibilities
    });
  }

  // Education
  if (resume.educations.length > 0) {
    sections.push('## Education');
    resume.educations.forEach((edu) => {
      sections.push(
        `- ${edu.degree} from ${edu.institution} (${edu.duration})`
      );
      // TODO: [LOW] Add GPA, honors, relevant coursework if available
      // TODO: [LOW] Extract major/concentration from degree string
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
      // TODO: [LOW] Add project links, tech stack, dates if available
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
          // TODO: [LOW] Filter out generic topics like "hacktoberfest", "awesome-list"
        }
        sections.push(
          `Stars: ${proj.stargazers_count}, Forks: ${proj.forks_count}`
        );
        sections.push(`URL: ${proj.html_url}`);
        sections.push('');
        // TODO: [LOW] Add project status (active, archived, etc.)
        // TODO: [LOW] Add last updated date
        // TODO: [LOW] Add README summary if available
        // TODO: [LOW] Prioritize projects by stars/forks/recency
      }
    });
  }

  // TODO: [MEDIUM] Add certifications section if available
  // TODO: [MEDIUM] Add publications/talks section if available
  // TODO: [LOW] Add awards/recognition section if available
  // TODO: [LOW] Add volunteer work section if available

  return sections.join('\n');
};

/**
 * Extract relevant context from knowledge base based on user question
 * Simple keyword-based relevance for now
 *
 * TODO: [HIGH] CRITICAL PERFORMANCE ISSUE - Replace with efficient search
 * Current implementation has O(n * m * k) complexity where:
 * - n = number of sections
 * - m = number of keywords
 * - k = section length
 * Creates new RegExp for EVERY keyword in EVERY section → 500+ RegExp objects
 * For large resumes: 10+ seconds of blocking UI on main thread
 *
 * TODO: [HIGH] Implement proper RAG with semantic search
 * Use sentence embeddings (e.g., BGE-small-en-v1.5 via Transformers.js)
 * Pre-compute embeddings for each section, then find most similar to question
 *
 * TODO: [MEDIUM] Add stop words filtering
 * Words like "the", "and", "is", "are" shouldn't be used for matching
 *
 * TODO: [MEDIUM] Add stemming/lemmatization
 * "developing" should match "developer", "development", "developed"
 *
 * TODO: [MEDIUM] Add synonym expansion
 * "React" should match "ReactJS", "React.js"
 * "ML" should match "Machine Learning", "AI"
 *
 * TODO: [LOW] Add query expansion (use related terms)
 * TODO: [LOW] Add TF-IDF or BM25 scoring for better relevance
 */
export const extractRelevantContext = (
  knowledgeBase: string,
  question: string
): string => {
  const questionLower = question.toLowerCase();

  // TODO: [HIGH] Pre-compile regex patterns and cache them
  // TODO: [MEDIUM] Add input validation (max question length, sanitization)

  // Keywords that indicate what the user is asking about
  const keywords = questionLower.split(/\s+/).filter((word) => word.length > 3); // Filter out small words
  // TODO: [HIGH] This is too naive - "what" is 4 chars but not useful
  // Need proper stop words list: ["what", "when", "where", "which", "who", "how", "can", "will", "would", etc.]
  // TODO: [MEDIUM] Add keyword deduplication
  // TODO: [MEDIUM] Remove punctuation from keywords

  // Score each section based on keyword matches
  const sections = knowledgeBase.split(/\n##\s/);
  // TODO: [LOW] This split pattern assumes specific markdown format - fragile
  // Consider using a proper markdown parser

  const scoredSections = sections.map((section) => {
    const sectionLower = section.toLowerCase();

    // TODO: [CRITICAL] PERFORMANCE: Creating RegExp in tight loop = catastrophic
    // BEFORE: 500+ RegExp creations, 10+ second freeze
    // BETTER: Pre-compile patterns or use indexOf
    // BEST: Use proper search index (e.g., Lunr.js, FlexSearch, or embeddings)
    const score = keywords.reduce((acc, keyword) => {
      // ⚠️ PERFORMANCE BOTTLENECK - creates new RegExp for every keyword/section pair
      const matches = (sectionLower.match(new RegExp(keyword, 'g')) || [])
        .length;
      return acc + matches;
    }, 0);
    // TODO: [MEDIUM] Weigh matches differently based on position
    // Matches in headers should score higher than body text
    // TODO: [MEDIUM] Consider proximity of keywords (keywords close together = more relevant)
    // TODO: [LOW] Penalize very long sections (might be less focused)

    return { section, score };
  });

  // Sort by relevance and take top sections
  const relevantSections = scoredSections
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3) // Top 3 most relevant sections
    .map((s) => s.section);
  // TODO: [MEDIUM] Make number of sections dynamic based on token budget
  // TODO: [LOW] Add score threshold - don't include low-scoring sections
  // TODO: [LOW] Consider section size when deciding how many to include

  if (relevantSections.length === 0) {
    // If no relevant sections found, return a summary
    return sections.slice(0, 2).join('\n## '); // Return first 2 sections (usually About and Summary)
    // TODO: [MEDIUM] Improve fallback strategy
    // Option 1: Return sections most likely to have general info (About, Summary, Skills)
    // Option 2: Return entire knowledge base if small enough
    // Option 3: Let user know we couldn't find relevant info, ask them to rephrase
  }

  return relevantSections.join('\n## ');
  // TODO: [MEDIUM] Add context window management
  // Truncate sections if combined length exceeds token limit
  // TODO: [LOW] Add section summaries to fit more info in context
  // TODO: [LOW] Track which sections were used for analytics
};

// TODO: [HIGH] Add proper semantic search function using embeddings
// Example implementation:
// export const extractRelevantContextSemantic = async (
//   knowledgeBase: string,
//   question: string,
//   embeddingModel: Pipeline
// ): Promise<string> => {
//   // 1. Split KB into chunks
//   // 2. Get embeddings for each chunk (cached)
//   // 3. Get embedding for question
//   // 4. Compute cosine similarity
//   // 5. Return top K chunks
// };

// TODO: [MEDIUM] Add knowledge base statistics function
// export const getKnowledgeBaseStats = (kb: string) => {
//   return {
//     totalSections: ...,
//     totalCharacters: ...,
//     estimatedTokens: ...,
//     sections: { skills: X, experience: Y, ... }
//   };
// };

// TODO: [MEDIUM] Add knowledge base validation
// export const validateKnowledgeBase = (kb: string): ValidationResult => {
//   // Check for empty sections
//   // Check for overly long sections
//   // Check for missing critical information
//   // Warn if exceeds token limits
// };

// TODO: [LOW] Add knowledge base compression for large resumes
// Summarize long sections, remove redundancy, etc.

// TODO: [LOW] Add multi-language support for international resumes
