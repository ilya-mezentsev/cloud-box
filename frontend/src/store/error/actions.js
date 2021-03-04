import { ACTIONS } from './actionTypes';

export function clearError() {
    return dispatch => dispatch({
        type: ACTIONS.UNSET_ERROR,
    });
}
