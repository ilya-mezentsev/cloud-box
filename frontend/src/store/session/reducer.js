import { ACTIONS } from './actionTypes';

/**
 *
 * @param {string} state
 * @param {{type: string, sessionHash?: string}} action
 * @return {string}
 */
export function sessionReducer(state = '', action) {
    switch (action.type) {
        case ACTIONS.SET_SESSION:
            return action.sessionHash;

        case ACTIONS.UNSET_SESSION:
            return '';

        default:
            return state;
    }
}
