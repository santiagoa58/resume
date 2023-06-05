import { IResumeMetadata } from '../types/api_types';

interface IUpdateResumeMetadataListAction {
  type: 'UPDATE_RESUME';
  // resume to update
  payload: IResumeMetadata;
}

interface IAddResumeMetadataListAction {
  type: 'ADD_RESUME';
  // resume to add
  payload: IResumeMetadata;
}

interface IRemoveResumeMetadataListAction {
  type: 'REMOVE_RESUME';
  // resume id to remove
  payload: string;
}

interface ISetResumeMetadataListAction {
  type: 'SET_RESUME_LIST';
  // resume list to set
  payload: IResumeMetadata[];
}

export type ResumeMetadataListAction =
  | IUpdateResumeMetadataListAction
  | IAddResumeMetadataListAction
  | IRemoveResumeMetadataListAction
  | ISetResumeMetadataListAction;

export const initialResumeMetadataListState: IResumeMetadata[] = [];

export const resumeMetadataListReducer = (
  state: IResumeMetadata[] = initialResumeMetadataListState,
  action: ResumeMetadataListAction
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
