import {
    fetchBoxes as fetchBoxesAPI,
    bindBox as bindBoxAPI,
} from '../../services/api';
import { ACTIONS } from './actionTypes';

/**
 *
 * @param {string} accountHash
 * @return {function(*): Promise<void>}
 */
export function fetchBoxes(accountHash) {
    return async dispatch => {
        try {
            const boxesResponse = await fetchBoxesAPI(accountHash);

            if (boxesResponse.isOk()) {
                dispatch({
                    type: ACTIONS.SET_BOXES,
                    boxes: boxesResponse.data(),
                });
            } else {
                console.error(`Error while fetching boxes: ${JSON.stringify(boxesResponse.data())}`);
            }
        } catch (e) {
            console.error(e);
        }
    };
}

/**
 *
 * @param {string} accountHash
 * @param {string} boxUUID
 * @param {string} alias
 * @return {function(*): Promise<void>}
 */
export function bindBox({accountHash, boxUUID, alias}) {
    return async () => {
        try {
            const bindBoxResponse = await bindBoxAPI({accountHash, boxUUID, alias});

            if (!bindBoxResponse.isOk()) {
                console.error(`Error while binding box with account: ${JSON.stringify(bindBoxResponse.data())}`);
            }
        } catch (e) {
            console.error(e);
        }
    };
}
