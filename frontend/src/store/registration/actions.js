import { registerUser } from '../../services/api';
import { ACTIONS } from './actionTypes';

/**
 *
 * @param {string} mail
 * @param {string} password
 * @return {function(*): Promise<void>}
 */
export function signUp({ mail, password }) {
    return async dispatch => {
        try {
            const registrationResponse = await registerUser({ mail, password });

            if (registrationResponse.isOk()) {
                // fixme: how to understand in container that action without response is performed successfully?
                console.log(`Registration performed successfully!`);
            } else {
                dispatch({
                    type: ACTIONS.FAILED_TO_REGISTER_USER,
                    error: registrationResponse.data(),
                });
            }
        } catch (e) {
            dispatch({
                type: ACTIONS.FAILED_TO_PERFORM_REGISTER_ACTION,
                error: e,
            });
        }
    };
}
