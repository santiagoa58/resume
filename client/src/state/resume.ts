import { IResume } from '../types/api_types';
import { updateObjectWithDefinedValues } from '../utils/object_utils';

type PartialResumeUpdatePayload = Partial<IResume> &
  Required<Pick<IResume, 'doc_id'>>;
interface IUpdateResumeAction {
  type: 'UPDATE_RESUME';
  // resume update
  payload: PartialResumeUpdatePayload;
}

interface IRemoveResumeAction {
  type: 'REMOVE_RESUME';
  // id of resume to remove
  payload: string;
}

interface ISetResumeAction {
  type: 'SET_RESUME';
  // resume to set
  payload: IResume;
}

export type ResumeAction =
  | IUpdateResumeAction
  | ISetResumeAction
  | IRemoveResumeAction;

export type ResumeState = Map<string, IResume>;
export const initialResumeState: ResumeState = new Map();

export const resumeReducer = (
  state: ResumeState = initialResumeState,
  action: ResumeAction
): ResumeState => {
  const updateState = immutableStateUpdater(state);
  switch (action.type) {
    case 'REMOVE_RESUME':
      return updateState((tempState) =>
        tempState.delete(action.payload) ? tempState : state
      );
    case 'SET_RESUME':
      return updateState((tempState) => {
        tempState.set(action.payload.doc_id, action.payload);
        return tempState;
      });
    case 'UPDATE_RESUME':
      if (state === undefined) {
        throw new Error('cannot update undefined resume');
      }
      if (!state.has(action.payload.doc_id)) {
        throw new Error(
          `resume ID of update doesn't match current state.  did you mean to SET_RESUME?`
        );
      }
      return updateState((tempState) => {
        tempState.set(
          action.payload.doc_id,
          updateObjectWithDefinedValues(
            tempState.get(action.payload.doc_id)!,
            action.payload
          )
        );
        return { ...state, ...action.payload };
      });
    default:
      return state;
  }
};

type StateUpdaterFunction = (state: ResumeState) => ResumeState;
const immutableStateUpdater =
  (state: ResumeState) => (updater: StateUpdaterFunction) => {
    const tempState = new Map(state);
    return updater(tempState);
  };
