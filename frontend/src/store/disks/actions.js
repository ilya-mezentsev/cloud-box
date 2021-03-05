import { getDisks } from '../../services/box';
import { ACTIONS } from './actionTypes';

/**
 *
 * @param {string} tunnelDomain
 * @param {string} boxUUID
 * @return {function(*): Promise<void>}
 */
export function fetchDisks({ tunnelDomain, boxUUID }) {
    return async dispatch => {
        try {
            const disksResponse = await getDisks({
                tunnelDomain,
                boxUUID,
            });

            if (disksResponse.isOk()) {
                dispatch({
                    type: ACTIONS.SET_DISKS,
                    disks: disksResponse.data(),
                });
            } else {
                dispatch({
                    type: ACTIONS.FAILED_TO_FETCH_DISKS,
                    error: disksResponse.data(),
                });
            }
        } catch (e) {
            dispatch({
                type: ACTIONS.FAILED_TO_PERFORM_DISKS_ACTION,
                error: e,
            });
        }
    };
}
