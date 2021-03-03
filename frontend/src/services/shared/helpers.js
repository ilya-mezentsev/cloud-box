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
    return Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
}
