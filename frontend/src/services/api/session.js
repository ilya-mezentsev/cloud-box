import {
    POST,
    GET,
    DELETE,
    SuccessResponse,
    errorResponseOrDefault,
    errorResponseOr,
} from '../shared'

class SessionResponse extends SuccessResponse {
    /**
     *
     * @return {{hash: string}}
     */
    data() {
        return super.data();
    }
}

/**
 *
 * @param {string} mail
 * @param {string} password
 * @return {Promise<SessionResponse | ErrorResponse>}
 */
export async function signIn({mail, password}) {
    const response = await POST({
        path: 'session',
        body: {mail, password},
    });

    return errorResponseOr(response, data => new SessionResponse(data));
}

/**
 *
 * @return {Promise<SuccessResponse | ErrorResponse>}
 */
export async function signOut() {
    const response = await DELETE({
        path: 'session',
    });

    return errorResponseOrDefault(response);
}

/**
 *
 * @return {Promise<SessionResponse | ErrorResponse>}
 */
export async function getSession() {
    const response = await GET({
        path: 'session',
    });

    return errorResponseOr(response, data => new SessionResponse(data));
}
