// test skillsUtils
import { IProject } from '../../types/api_types';
import * as utils from '../skillsUtils';

test('getConsistentSkillName', () => {
  expect(utils.getConsistentSkillName('react')).toEqual('react');
  expect(utils.getConsistentSkillName('reactjs')).toEqual('react');
  expect(utils.getConsistentSkillName('react.js')).toEqual('react');
  expect(utils.getConsistentSkillName('frontend')).toEqual('frontend');
  expect(utils.getConsistentSkillName('front-end')).toEqual('frontend');
  expect(utils.getConsistentSkillName('front end')).toEqual('frontend');
  expect(utils.getConsistentSkillName('front_end')).toEqual('frontend');
  expect(utils.getConsistentSkillName('backend')).toEqual('backend');
  expect(utils.getConsistentSkillName('back-end')).toEqual('backend');
  expect(utils.getConsistentSkillName('back end')).toEqual('backend');
  expect(utils.getConsistentSkillName('back_end')).toEqual('backend');
  expect(utils.getConsistentSkillName('fullstack')).toEqual('fullstack');
  expect(utils.getConsistentSkillName('full-stack')).toEqual('fullstack');
  expect(utils.getConsistentSkillName('full stack')).toEqual('fullstack');
  expect(utils.getConsistentSkillName('full_stack')).toEqual('fullstack');
  expect(utils.getConsistentSkillName('javascript')).toEqual('javascript');
  expect(utils.getConsistentSkillName('js')).toEqual('javascript');
  expect(utils.getConsistentSkillName('typescript')).toEqual('typescript');
  expect(utils.getConsistentSkillName('ts')).toEqual('typescript');
  expect(utils.getConsistentSkillName('python')).toEqual('python');
  expect(utils.getConsistentSkillName('py')).toEqual('python');
  expect(utils.getConsistentSkillName('aws')).toEqual('aws');
  expect(utils.getConsistentSkillName('amazon web services')).toEqual('aws');
});
describe('commandOutputTagFunction', () => {
  it('should return the correct JSX', () => {
    const result = utils.commandOutputTagFunction`Type ${utils.COMMANDS.LIST_SKILLS} to view a list of all my skills.`;
    expect(result).toMatchSnapshot();
  });
});
describe('normalizeCommand', () => {
  it('should return the correct value', () => {
    expect(utils.normalizeCommand('list skills')).toEqual(
      utils.COMMANDS.LIST_SKILLS
    );
    expect(utils.normalizeCommand('list skills ')).toEqual(
      utils.COMMANDS.LIST_SKILLS
    );
    expect(utils.normalizeCommand(' list skills')).toEqual(
      utils.COMMANDS.LIST_SKILLS
    );
    expect(utils.normalizeCommand(' list skills ')).toEqual(
      utils.COMMANDS.LIST_SKILLS
    );
  });
});
describe('getProjectSkills', () => {
  it('should return the correct value', () => {
    const projects: Partial<IProject>[] = [
      {
        name: 'project 1',
        description: 'project 1 description',
        languages: ['javascript', 'ts'],
        topics: ['aws', 'css', 'VANILLA JS'],
      },
      {
        name: 'project 2',
        description: 'project 2 description',
        languages: ['python', 'ts', 'css'],
        topics: ['front-end', 'back end', 'advanced-css-and-sass'],
      },
    ];
    const result = utils.getProjectSkills(projects as IProject[]);
    expect(result).toEqual([
      {
        projectName: 'project 1',
        skillSet: ['typescript', 'aws', 'css', 'vanilla javascript'],
      },
      {
        projectName: 'project 2',
        skillSet: [
          'python',
          'typescript',
          'frontend',
          'backend',
          'advanced css and sass',
        ],
      },
    ]);
  });
});
