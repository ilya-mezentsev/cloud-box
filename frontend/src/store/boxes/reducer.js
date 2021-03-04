import { ACTIONS } from '../session/actionTypes';

/**
 *
 * @param {Array<{tunnelDomain: string, uuid: string, alias: string}>} state
 * @param {{type: string, boxes?: Array<{tunnelDomain: string, uuid: string, alias: string}>}} action
 * @return {Array<{tunnelDomain: string, uuid: string, alias: string}>}
 */
export function boxesReducer(state = [], action) {
    switch (action.type) {
        case ACTIONS.SET_BOXES:
            return action.boxes;

        default:
            return state;
    }
}
