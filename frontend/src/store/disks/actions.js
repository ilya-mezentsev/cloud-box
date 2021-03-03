import { getDisks } from '../../services/box';
import { ACTIONS } from './actionTypes';

/**
 *
 * @param {string} tunnelDomain
 * @param {string} boxUUID
 * @return {function(*): Promise<void>}
 */
export function fetchDisks({tunnelDomain, boxUUID}) {
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
                console.error(`Error while fetching disks: ${JSON.stringify(disksResponse.data())}`);
            }
        } catch (e) {
            console.error(e);
        }
    };
}
