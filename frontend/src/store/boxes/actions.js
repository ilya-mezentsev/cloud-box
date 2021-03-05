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
                dispatch({
                    type: ACTIONS.FAILED_TO_FETCH_BOXES,
                    error: boxesResponse.data(),
                });
            }
        } catch (e) {
            dispatch({
                type: ACTIONS.FAILED_TO_PERFORM_BOXES_ACTION,
                error: e,
            });
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
export function bindBox({ accountHash, boxUUID, alias }) {
    return async dispatch => {
        try {
            const bindBoxResponse = await bindBoxAPI({
                accountHash,
                boxUUID,
                alias,
            });

            if (bindBoxResponse.isOk()) {
                // fixme: how to understand in container that action without response is performed successfully?
                console.log('Box bounded successfully');
            } else {
                dispatch({
                    type: ACTIONS.FAILED_TO_FETCH_BOXES,
                    error: bindBoxResponse.data(),
                });
            }
        } catch (e) {
            dispatch({
                type: ACTIONS.FAILED_TO_PERFORM_BOXES_ACTION,
                error: e,
            });
        }
    };
}
