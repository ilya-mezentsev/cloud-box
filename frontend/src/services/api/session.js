import {
    POST,
    GET,
    DELETE,
    SuccessResponse,
    errorResponseOrDefault,
    errorResponseOr,
} from '../shared'

export class SessionResponse extends SuccessResponse {
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
export async function createSession({mail, password}) {
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
export async function deleteSession() {
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
