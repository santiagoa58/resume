import { IResumeMetadata } from '../types/api_types';

interface IUpdateResumeListAction {
  type: 'UPDATE_RESUME';
  // resume to update
  payload: IResumeMetadata;
}

interface IAddResumeListAction {
  type: 'ADD_RESUME';
  // resume to add
  payload: IResumeMetadata;
}

interface IRemoveResumeListAction {
  type: 'REMOVE_RESUME';
  // resume id to remove
  payload: string;
}

interface ISetResumeListAction {
  type: 'SET_RESUME_LIST';
  // resume list to set
  payload: IResumeMetadata[];
}

export type ResumeListAction =
  | IUpdateResumeListAction
  | IAddResumeListAction
  | IRemoveResumeListAction
  | ISetResumeListAction;

export const initialResumeListState: IResumeMetadata[] = [];

export const resumeListReducer = (
  state: IResumeMetadata[] = initialResumeListState,
  action: ResumeListAction
) => {
  switch (action.type) {
    case 'UPDATE_RESUME':
      return state.map((resume) => {
        if (resume.id === action.payload.id) {
          return action.payload;
        }
        return resume;
      });
    case 'ADD_RESUME':
      return [...state, action.payload];
    case 'REMOVE_RESUME':
      return state.filter((resume) => resume.id !== action.payload);
    case 'SET_RESUME_LIST':
      return action.payload;
    default:
      return state;
  }
};
