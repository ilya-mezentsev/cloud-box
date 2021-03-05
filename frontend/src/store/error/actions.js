import { ACTIONS } from './actionTypes';

export function clearError() {
    return {
        type: ACTIONS.UNSET_ERROR,
    };
}
