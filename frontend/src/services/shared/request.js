const METHOD = {
    GET: 'GET',
    POST: 'POST',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
}

/**
 *
 * @param {string|null} absolutePath
 * @param {string} path
 * @param {Object|null} params
 * @return {Promise<any>}
 */
export async function GET({
    absolutePath = null,
    path,
    params = null,
}) {
    path = removeLeadingAndTrailingSlashes(path);
    if (params !== null) {
        path = `${path}?${buildQueryParams(params)}`
    }

    return await request(
        `${absolutePath ?? ''}/${path}`,
        METHOD.GET,
    );
}

/**
 *
 * @param {string|null} absolutePath
 * @param {string} path
 * @param {Object} body
 * @param {string} contentType
 * @return {Promise<any>}
 */
export async function POST({
    absolutePath = null,
    path,
    body,
    contentType = 'application/json',
}) {
    return await request(
        `${absolutePath ?? ''}/${removeLeadingAndTrailingSlashes(path)}`,
        METHOD.POST,
        body,
        contentType,
    );
}

/**
 *
 * @param {string|null} absolutePath
 * @param {string} path
 * @param {Object} body
 * @return {Promise<any>}
 */
export async function PATCH({
    absolutePath = null,
    path,
    body,
}) {
    return await request(
        `${absolutePath ?? ''}/${removeLeadingAndTrailingSlashes(path)}`,
        METHOD.PATCH,
        body,
    );
}

/**
 *
 * @param {string|null} absolutePath
 * @param {string} path
 * @param {Object|null} params
 * @return {Promise<any>}
 */
export async function DELETE({
    absolutePath = null,
    path,
    params = null,
}) {
    path = removeLeadingAndTrailingSlashes(path);
    if (params !== null) {
        path = `${path}?${buildQueryParams(params)}`
    }

    return await request(
        `${absolutePath ?? ''}/${path}`,
        METHOD.DELETE
    );
}

/**
 *
 * @param {string} path
 * @param {string} method
 * @param {Object | null} body
 * @param {string} contentType
 * @return {Promise<any>}
 */
async function request(
    path,
    method,
    body = null,
    contentType = 'application/json',
) {
    const options = {
        method,
        headers: {
            'Content-Type': contentType,
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
        `/api/${path}`,
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
