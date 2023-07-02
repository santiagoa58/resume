export const MAIN_PROJECT = 'main' as const;
export const OUTDATED_PROJECT = 'outdated' as const;

/**
 * @description skills that can be added to a project which have different ways of being displayed
 */
export const SKILLS_VARIETY = {
  JAVASCRIPT: new Set([
    'js',
    'javascript',
    'es6',
    'es7',
    'es6+',
    'es2015',
    'es2016',
    'es2017',
    'ecmascript',
  ]),
  TYPESCRIPT: new Set(['ts', 'typescript']),
  FRONTEND: new Set(['frontend', 'front-end', 'front end', 'front_end']),
  BACKEND: new Set(['backend', 'back-end', 'back end', 'back_end']),
  FULLSTACK: new Set(['fullstack', 'full-stack', 'full stack', 'full_stack']),
  REACT: new Set(['react', 'reactjs', 'react.js']),
  RXJS: new Set(['rxjs', 'rx.js', 'rx.js']),
  REDUX: new Set(['redux', 'reduxjs', 'redux.js']),
  NODE: new Set(['node', 'nodejs', 'node.js']),
  EXPRESS: new Set(['express', 'expressjs', 'express.js']),
  PYTHON: new Set(['python', 'py']),
  C: new Set(['c']),
  'C++': new Set(['c++', 'cpp']),
  'C#': new Set(['c#', 'csharp']),
  DOTNET: new Set(['.net', 'dotnet']),
  GO: new Set(['go', 'golang']),
  SQL: new Set(['sql']),
  AWS: new Set(['aws', 'amazon web services']),
  GCP: new Set(['gcp', 'google cloud platform']),
  AZURE: new Set(['azure']),
  DOCKER: new Set(['docker', 'docker container']),
  KUBERNETES: new Set(['kubernetes', 'k8s']),
  'REST API': new Set([
    'rest',
    'rest api',
    'rest apis',
    'restful api',
    'restful apis',
  ]),
  GRAPHQL: new Set(['graphql', 'graph ql']),
  HTML: new Set(['html', 'html5']),
  CSS: new Set(['css', 'css3']),
} as const;
