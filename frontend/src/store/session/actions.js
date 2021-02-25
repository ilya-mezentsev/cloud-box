import { ACTIONS } from './actionTypes';
import { getSession, createSession, deleteSession } from '../../services/api';

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
                onOkSessionResponse(dispatch, sessionResponse);
            } else {
                onErrorSessionResponse(sessionResponse);
            }
        } catch (e) {
            console.error(e);
        }
    };
}

/**
 *
 * @param {function({type: string, sessionHash: string})} dispatch
 * @param {SessionResponse} session
 */
function onOkSessionResponse(dispatch, session) {
    dispatch({
        type: ACTIONS.SET_SESSION,
        sessionHash: session.data().hash,
    });
}

/**
 *
 * @param {ErrorResponse} session
 */
function onErrorSessionResponse(session) {
    console.log(`Error while trying to create session: ${JSON.stringify(session.data())}`);
}

/**
 *
 * @return {function(*): Promise<void>}
 */
export function fetchSession() {
    return async dispatch => {
        try {
            const sessionResponse = await getSession();

            if (sessionResponse.isOk()) {
                onOkSessionResponse(dispatch, sessionResponse);
            } else {
                onErrorSessionResponse(sessionResponse);
            }
        } catch (e) {
            console.error(e);
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
                onErrorSessionResponse(deleteSessionResponse);
            }
        } catch (e) {
            console.error(e);
        }
    };
}
