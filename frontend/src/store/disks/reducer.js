import { ACTIONS } from './actionTypes';

/**
 *
 * @param {Array<string>} state
 * @param {{type: string, disks: Array<string>}} action
 * @return {Array<string>}
 */
export function disksReducer(state = [], action) {
    switch (action.type) {
        case ACTIONS.SET_DISKS:
            return action.disks;

        default:
            return state;
    }
}
