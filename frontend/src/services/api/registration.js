import { POST, errorResponseOrDefault } from '../shared';

/**
 *
 * @param {string} mail
 * @param {string} password
 * @return {Promise<SuccessResponse | ErrorResponse>}
 */
export async function registerUser({mail, password}) {
    const response = await POST({
        path: 'registration/user',
        body: {mail, password},
    });

    return errorResponseOrDefault(response);
}
