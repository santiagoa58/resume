import { IResume } from '../types/api_types';

type PartialResumeUpdatePayload = Partial<IResume> & Required<Pick<IResume, 'doc_id'>>;
interface IUpdateResumeAction {
    type: 'UPDATE_RESUME';
    // resume update
    payload: PartialResumeUpdatePayload;
}

interface IRemoveResumeAction {
    type: 'REMOVE_RESUME';
}

interface ISetResumeAction {
    type: 'SET_RESUME';
    // resume to set
    payload: IResume;
}

export type ResumeAction = IUpdateResumeAction | ISetResumeAction | IRemoveResumeAction;

export const resumeReducer = (
    state: IResume | undefined,
    action: ResumeAction
) => {
    switch (action.type) {
        case 'REMOVE_RESUME':
            return undefined;
        case 'SET_RESUME':
            return action.payload;
        case 'UPDATE_RESUME':
            if (state == undefined) {
                throw new Error('cannot update undefined resume');
            }
            if (state.doc_id !== action.payload.doc_id) {
                throw new Error(`resume ID of update doesn't match current state.  did you mean to SET_RESUME?`)
            }
            return { ...state, ...action.payload }
        default:
            return state;
    }
};