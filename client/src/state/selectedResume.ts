import { IResumeMetadata } from '../types/api_types';

interface ISetSelectedResumeAction {
  type: 'SET_SELECTED_RESUME';
  // selected resume to set
  payload: IResumeMetadata | undefined;
}

export type SelectResumeAction = ISetSelectedResumeAction;

export const selectResumeReducer = (
  state: IResumeMetadata | undefined = undefined,
  action: SelectResumeAction
) => {
  switch (action.type) {
    case 'SET_SELECTED_RESUME':
      return action.payload;
    default:
      return state;
  }
};
