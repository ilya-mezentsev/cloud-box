import { ACTIONS } from './actionTypes';

/**
 *
 * @param {{code?: string, description: string}|null} state
 * @param {{type: string, error?: {code?: string, description: string}|{error: Error}}} action
 * @return {{code?: string, description: string}|null}
 */
export function errorReducer(state = null, action) {
    switch (action.type) {
        case ACTIONS.SET_ERROR:
            return action.error;

        case ACTIONS.SET_UNKNOWN_ERROR:
            console.error(action.error.error);
            return {
                code: 'unknown-error',
                description: 'Unknown error occurred',
            };

        case ACTIONS.UNSET_ERROR:
            return null;

        default:
            return state;
    }
}
