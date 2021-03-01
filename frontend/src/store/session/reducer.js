import { ACTIONS } from './actionTypes';
import { initialState } from '../state/initial';

/**
 *
 * @param {{hash: string|null}} state
 * @param {{type: string, sessionHash?: string}} action
 * @return {Object}
 */
export function sessionReducer(state = initialState, action) {
    switch (action.type) {
        case ACTIONS.SET_SESSION:
            return {
                ...state,
                hash: action.sessionHash,
            };

        case ACTIONS.UNSET_SESSION:
            return {
                ...state,
                hash: null,
            };

        default:
            return state;
    }
}
