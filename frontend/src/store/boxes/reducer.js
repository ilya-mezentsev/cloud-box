import { initialState } from '../state/initial';
import { ACTIONS } from '../session/actionTypes';

/**
 *
 * @param {Object} state
 * @param {{type: string, boxes?: Array<{tunnelDomain: string, uuid: string, alias: string}>}} action
 * @return {Object}
 */
export function boxesReducer(state = initialState, action) {
    switch (action.type) {
        case ACTIONS.SET_BOXES:
            return {
                ...state,
                boxes: action.boxes,
            };

        default:
            return state;
    }
}
