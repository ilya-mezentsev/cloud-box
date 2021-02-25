import { initialState } from '../state/initial';
import { ACTIONS } from './actionTypes';

/**
 *
 * @param {Object} state
 * @param {{type: string, disks: Array<string>}} action
 * @return {Object}
 */
export function disksReducer(state = initialState, action) {
    switch (action.type) {
        case ACTIONS.SET_DISKS:
            return {
                ...state,
                disks: action.disks,
            };

        default:
            return state;
    }
}
