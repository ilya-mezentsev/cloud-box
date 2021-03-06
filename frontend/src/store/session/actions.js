import { ACTIONS } from './actionTypes';
import { getSession, createSession, deleteSession } from '../../services/api';

/**
 *
 * @return {function(*): Promise<void>}
 */
export function fetchSession() {
    return async dispatch => {
        try {
            const sessionResponse = await getSession();

            if (sessionResponse.isOk()) {
                dispatch({
                    type: ACTIONS.SET_SESSION,
                    sessionHash: sessionResponse.data().hash,
                });
            } else {
                dispatch({
                    type: ACTIONS.FAILED_TO_GET_SESSION,
                    error: sessionResponse.data(),
                });
            }
        } catch (e) {
            dispatch({
                type: ACTIONS.FAILED_TO_PERFORM_SESSION_ACTION,
                error: e,
            });
        }
    };
}

/**
 *
 * @param {string} mail
 * @param {string} password
 * @return {function(*): Promise<void>}
 */
export function signIn({ mail, password }) {
    return async dispatch => {
        try {
            const sessionResponse = await createSession({mail, password});

            if (sessionResponse.isOk()) {
                dispatch({
                    type: ACTIONS.SET_SESSION,
                    sessionHash: sessionResponse.data().hash,
                });
            } else {
                dispatch({
                    type: ACTIONS.FAILED_TO_CREATE_SESSION,
                    error: sessionResponse.data(),
                });
            }
        } catch (e) {
            dispatch({
                type: ACTIONS.FAILED_TO_PERFORM_SESSION_ACTION,
                error: e,
            });
        }
    };
}

/**
 *
 * @return {function(*): Promise<void>}
 */
export function signOut() {
    return async dispatch => {
        try {
            const deleteSessionResponse = await deleteSession();

            if (deleteSessionResponse.isOk()) {
                dispatch({
                    type: ACTIONS.UNSET_SESSION,
                });
            } else {
                dispatch({
                    type: ACTIONS.FAILED_TO_DELETE_SESSION,
                    error: deleteSessionResponse.data(),
                });
            }
        } catch (e) {
            dispatch({
                type: ACTIONS.FAILED_TO_PERFORM_SESSION_ACTION,
                error: e,
            });
        }
    };
}
