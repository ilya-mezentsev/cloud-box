export class APIResponse {
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

export class ErrorResponse extends APIResponse {
    isOk() {
        return false;
    }

    /**
     *
     * @return {{code?: string, description: string}}
     */
    data() {
        return super.data();
    }
}

export const API_STATUS = {
    OK: 'ok',
    ERROR: 'error',
};

/**
 *
 * @param {string} status
 * @return {boolean}
 */
export const isOkApiResponseStatus = status => status === API_STATUS.OK;

/**
 *
 * @param {string} status
 * @return {boolean}
 */
export const isErrorApiResponseStatus = status => status === API_STATUS.ERROR;

/**
 *
 * @param {{status: 'ok' | 'error', data: any}} apiResponse
 * @return {SuccessResponse | ErrorResponse}
 */
export function errorResponseOrDefault(apiResponse) {
    if (isErrorApiResponseStatus(apiResponse?.status)) {
        return new ErrorResponse(apiResponse.data);
    } else {
        return new SuccessResponse();
    }
}

/**
 *
 * @param {{status: 'ok' | 'error', data: any}} apiResponse
 * @param {function(any): SuccessResponse} successResponseConstructor
 * @return {SuccessResponse | ErrorResponse}
 */
export function errorResponseOr(apiResponse, successResponseConstructor) {
    if (isErrorApiResponseStatus(apiResponse?.status)) {
        return new ErrorResponse(apiResponse.data);
    } else {
        return successResponseConstructor(apiResponse?.data);
    }
}
