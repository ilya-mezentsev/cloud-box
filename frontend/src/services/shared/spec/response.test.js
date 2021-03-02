import { SuccessResponse, ErrorResponse, errorResponseOr, errorResponseOrDefault } from '../response';

describe('build response tests', () => {
    it('error response or default (returns default success response)', () => {
        const response = errorResponseOrDefault({status: 'ok', data: 'foo-bar'});

        expect(response).toBeInstanceOf(SuccessResponse);
        expect(response.isOk()).toBeTruthy();
        expect(response.data()).toBeNull();
    });

    it('error response or default (returns error response)', () => {
        const response = errorResponseOrDefault({status: 'error', data: 'some-error'});

        expect(response).toBeInstanceOf(ErrorResponse);
        expect(response.isOk()).toBeFalsy();
        expect(response.data()).toEqual('some-error');
    });

    it('error response or (calls callback)', () => {
        const mockResponseConstructor = data => new SuccessResponse(data);

        const response = errorResponseOr(
            {status: 'ok', data: 'foo-bar'},
            mockResponseConstructor,
        );

        expect(response).toBeInstanceOf(SuccessResponse);
        expect(response.isOk()).toBeTruthy();
        expect(response.data()).toEqual('foo-bar');
    });

    it('error response or (returns error)', () => {
        const mockResponseConstructor = data => new SuccessResponse(data);

        const response = errorResponseOr(
            {status: 'error', data: 'foo-bar'},
            mockResponseConstructor,
        );

        expect(response).toBeInstanceOf(ErrorResponse);
        expect(response.isOk()).toBeFalsy();
        expect(response.data()).toEqual('foo-bar');
    });
});
