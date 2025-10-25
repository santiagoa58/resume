import {
  createKnowledgeBase,
  extractRelevantContext,
} from '../knowledgeBaseOptimized';
import { mockResume, mockProject } from '../../../test_utils/apiMocks';

describe('knowledgeBaseOptimized', () => {
  describe('createKnowledgeBase', () => {
    it('should create knowledge base from resume and projects', () => {
      const kb = createKnowledgeBase(mockResume, [mockProject]);

      expect(kb).toContain(mockResume.name);
      expect(kb).toContain(mockResume.title);
      expect(kb).toContain(mockResume.summary);
      expect(kb).toContain(mockProject.name);
      expect(kb).toContain(mockProject.description);
    });

    it('should include all skills', () => {
      const kb = createKnowledgeBase(mockResume, []);

      mockResume.skills.forEach((skill) => {
        expect(kb).toContain(skill);
      });
    });

    it('should include experience details', () => {
      const kb = createKnowledgeBase(mockResume, []);

      expect(kb).toContain(mockResume.experiences[0].company);
      expect(kb).toContain(mockResume.experiences[0].role);
      expect(kb).toContain(mockResume.experiences[0].location);
    });

    it('should include education details', () => {
      const kb = createKnowledgeBase(mockResume, []);

      expect(kb).toContain(mockResume.educations[0].institution);
      expect(kb).toContain(mockResume.educations[0].degree);
    });

    it('should handle undefined resume', () => {
      const kb = createKnowledgeBase(undefined, [mockProject]);

      expect(kb).toContain('No resume data available yet');
      expect(kb).not.toContain('undefined');
    });

    it('should handle empty projects array', () => {
      const kb = createKnowledgeBase(mockResume, []);

      expect(kb).toContain(mockResume.name);
      expect(kb).toBeTruthy();
    });

    it('should handle both undefined resume and empty projects', () => {
      const kb = createKnowledgeBase(undefined, []);

      expect(kb).toBe('No resume data available yet.');
    });

    it('should include personal projects from resume', () => {
      const kb = createKnowledgeBase(mockResume, []);

      expect(kb).toContain(mockResume.personal_projects[0].name);
      expect(kb).toContain(mockResume.personal_projects[0].description);
    });

    it('should include project languages', () => {
      const kb = createKnowledgeBase(undefined, [mockProject]);

      mockProject.languages.forEach((lang) => {
        expect(kb).toContain(lang);
      });
    });

    it('should structure knowledge base with sections', () => {
      const kb = createKnowledgeBase(mockResume, [mockProject]);

      expect(kb).toContain('# About');
      expect(kb).toContain('## Skills');
      expect(kb).toContain('## Work Experience');
      expect(kb).toContain('## Education');
      expect(kb).toContain('## GitHub Projects');
    });
  });

  describe('extractRelevantContext', () => {
    const knowledgeBase = createKnowledgeBase(mockResume, [mockProject]);

    it('should extract relevant sections based on query', () => {
      const context = extractRelevantContext(knowledgeBase, 'What are your skills?');

      expect(context).toContain('Skills');
      expect(context.length).toBeGreaterThan(0);
    });

    it('should handle React-related queries', () => {
      const kb = `
        ## Skills
        React, TypeScript, Node.js

        ## Work Experience
        ### React Developer at Tech Corp
        Built React applications
      `;

      const context = extractRelevantContext(kb, 'Tell me about React experience');

      expect(context).toContain('React');
    });

    it('should extract education section for education queries', () => {
      const context = extractRelevantContext(
        knowledgeBase,
        'Where did you study?'
      );

      expect(context).toContain('Education');
      expect(context).toContain(mockResume.educations[0].institution);
    });

    it('should extract projects section for project queries', () => {
      const context = extractRelevantContext(
        knowledgeBase,
        'Tell me about your projects'
      );

      expect(context).toContain('Projects');
      expect(context).toContain(mockProject.name);
    });

    it('should handle case-insensitive queries', () => {
      const context1 = extractRelevantContext(knowledgeBase, 'REACT');
      const context2 = extractRelevantContext(knowledgeBase, 'react');
      const context3 = extractRelevantContext(knowledgeBase, 'React');

      // All should extract similar content
      expect(context1.length).toBeGreaterThan(0);
      expect(context2.length).toBeGreaterThan(0);
      expect(context3.length).toBeGreaterThan(0);
    });

    it('should return entire KB if no specific keywords match', () => {
      const context = extractRelevantContext(
        knowledgeBase,
        'xyz123 nonexistent'
      );

      // Should return something, likely the whole KB or top sections
      expect(context.length).toBeGreaterThan(0);
    });

    it('should limit context size', () => {
      const largeKB = 'x'.repeat(50000); // 50KB of data
      const context = extractRelevantContext(largeKB, 'test query');

      // Should not return the entire large KB
      expect(context.length).toBeLessThan(largeKB.length);
    });

    it('should extract multiple relevant sections', () => {
      const context = extractRelevantContext(
        knowledgeBase,
        'What is your experience with Go programming?'
      );

      // Should include both skills and projects (Go is in mockProject)
      expect(context).toContain('Go');
    });

    it('should handle empty knowledge base', () => {
      const context = extractRelevantContext('', 'any query');

      expect(context).toBe('');
    });

    it('should handle empty query', () => {
      const context = extractRelevantContext(knowledgeBase, '');

      // Should still return some context
      expect(context.length).toBeGreaterThan(0);
    });

    it('should use optimized indexOf instead of RegExp', () => {
      // This is a performance test - measuring execution time
      const largeKB = createKnowledgeBase(mockResume, Array(100).fill(mockProject));
      const startTime = performance.now();

      extractRelevantContext(largeKB, 'React TypeScript Node.js Go Python');

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Should complete in reasonable time (< 100ms for 100 projects)
      expect(executionTime).toBeLessThan(100);
    });

    it('should prioritize sections with more keyword matches', () => {
      const kb = `
        === SECTION A ===
        React mentioned once

        === SECTION B ===
        React React React mentioned multiple times with React
      `;

      const context = extractRelevantContext(kb, 'React');

      // Section B should be included as it has more matches
      expect(context).toContain('SECTION B');
    });

    it('should extract context for technology stack queries', () => {
      const context = extractRelevantContext(
        knowledgeBase,
        'What technologies do you use?'
      );

      // Should include skills section
      expect(context).toContain('Skills');
    });

    it('should handle special characters in query', () => {
      const context = extractRelevantContext(
        knowledgeBase,
        'C++ & Node.js experience?'
      );

      expect(context.length).toBeGreaterThan(0);
    });
  });
});
