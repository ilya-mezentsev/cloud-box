class APIResponse {
    constructor(data = null) {
        this._data = data;
    }

    /**
     *
     * @return {boolean}
     */
    isOk() {
        throw TypeError('Not implemented');
    }

    /**
     *
     * @return {any}
     */
    data() {
        return this._data;
    }
}

export class SuccessResponse extends APIResponse {
    isOk() {
        return true;
    }
}

class ErrorResponse extends APIResponse {
    isOk() {
        return false;
    }

    /**
     *
     * @return {{code: string, description: string}}
     */
    data() {
        return super.data();
    }
}

/**
 *
 * @param {{status: 'ok' | 'error', data: any}} apiResponse
 * @return {SuccessResponse | ErrorResponse}
 */
export function errorResponseOrDefault(apiResponse) {
    if (apiResponse.status === 'ok') {
        return new SuccessResponse(apiResponse.data);
    } else {
        return new ErrorResponse(apiResponse.data);
    }
}

/**
 *
 * @param {{status: 'ok' | 'error', data: any}} apiResponse
 * @param {Function} successResponseConstructor
 * @return {SuccessResponse | ErrorResponse}
 */
export function errorResponseOr(apiResponse, successResponseConstructor) {
    if (apiResponse.status === 'ok') {
        return successResponseConstructor(apiResponse.data);
    } else {
        return new ErrorResponse(apiResponse.data);
    }
}
