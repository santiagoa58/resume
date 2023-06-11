import { IProject } from '../types/api_types';

interface IUpdateProjectAction {
  type: 'UPDATE_PROJECT';
  // Project to update
  payload: IProject;
}

interface IAddProjectAction {
  type: 'ADD_PROJECT';
  // Project to add
  payload: IProject;
}

interface IRemoveProjectAction {
  type: 'REMOVE_PROJECT';
  // Project id to remove
  payload: number;
}

interface ISetProjectListAction {
  type: 'SET_PROJECT_LIST';
  // Project list to set
  payload: IProject[];
}

export type ProjectAction =
  | IUpdateProjectAction
  | IAddProjectAction
  | IRemoveProjectAction
  | ISetProjectListAction;

export const initialProjectState: IProject[] = [];

export const projectReducer = (
  state: IProject[] = initialProjectState,
  action: ProjectAction
): IProject[] => {
  switch (action.type) {
    case 'UPDATE_PROJECT':
      return state.map((Project) => {
        if (Project.id === action.payload.id) {
          return action.payload;
        }
        return Project;
      });
    case 'ADD_PROJECT':
      return [...state, action.payload];
    case 'REMOVE_PROJECT':
      return state.filter((project) => project.id !== action.payload);
    case 'SET_PROJECT_LIST':
      return action.payload;
    default:
      return state;
  }
};
