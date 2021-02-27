const METHOD = {
    GET: 'GET',
    POST: 'POST',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
}
const DEFAULT_PATH_PREFIX = '/api'

/**
 *
 * @param {string|null} absolutePath
 * @param {string} path
 * @param {Object|null} params
 * @param {Object|null} headers
 * @return {Promise<any>}
 */
export async function GET({
    absolutePath = null,
    path,
    params = null,
    headers = null,
}) {
    path = removeLeadingAndTrailingSlashes(path);
    if (params !== null) {
        path = `${path}?${buildQueryParams(params)}`
    }

    return await request({
        path: `${absolutePath ?? DEFAULT_PATH_PREFIX}/${path}`,
        method: METHOD.GET,
        headers,
    });
}

/**
 *
 * @param {string|null} absolutePath
 * @param {string} path
 * @param {Object} body
 * @param {string} contentType
 * @param {Object|null} headers
 * @return {Promise<any>}
 */
export async function POST({
    absolutePath = null,
    path,
    body,
    contentType = 'application/json',
    headers = null,
}) {
    return await request({
        path: `${absolutePath ?? DEFAULT_PATH_PREFIX}/${removeLeadingAndTrailingSlashes(path)}`,
        method: METHOD.POST,
        body,
        contentType,
        headers,
    });
}

/**
 *
 * @param {string|null} absolutePath
 * @param {string} path
 * @param {Object} body
 * @param {Object|null} headers
 * @return {Promise<any>}
 */
export async function PATCH({
    absolutePath = null,
    path,
    body,
    headers = null,
}) {
    return await request({
        path: `${absolutePath ?? DEFAULT_PATH_PREFIX}/${removeLeadingAndTrailingSlashes(path)}`,
        method: METHOD.PATCH,
        body,
        headers,
    });
}

/**
 *
 * @param {string|null} absolutePath
 * @param {string} path
 * @param {Object|null} params
 * @param {Object|null} headers
 * @return {Promise<any>}
 */
export async function DELETE({
    absolutePath = null,
    path,
    params = null,
    headers = null,
}) {
    path = removeLeadingAndTrailingSlashes(path);
    if (params !== null) {
        path = `${path}?${buildQueryParams(params)}`
    }

    return await request({
        path: `${absolutePath ?? DEFAULT_PATH_PREFIX}/${path}`,
        method: METHOD.DELETE,
        headers,
    });
}

/**
 *
 * @param {string} path
 * @param {string} method
 * @param {Object | null} body
 * @param {string} contentType
 * @param {Object|null} headers
 * @return {Promise<any>}
 */
async function request({
    path,
    method,
    body = null,
    contentType = 'application/json',
    headers = null,
}) {
    const options = {
        method,
        headers: {
            'Content-Type': contentType,
            ...(headers ?? {}),
        }
    }
    if (body !== null) {
        // todo should be tested
        if (body instanceof FormData) {
            options['body'] = body;
        } else {
            options['body'] = JSON.stringify(body);
        }
    }

    const res = await fetch(
        path,
        options,
    );

    return await res.json();
}

/**
 *
 * @param {string} path
 * @return {string}
 */
export function removeLeadingAndTrailingSlashes(path) {
    while (path.startsWith('/')) {
        path = path.substr(1)
    }
    while (path.endsWith('/')) {
        path = path.substr(0, path.length - 1);
    }

    return path;
}

/**
 *
 * @param {Object} params
 * @return {string}
 */
export function buildQueryParams(params) {
    return params
        .entries()
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
}
