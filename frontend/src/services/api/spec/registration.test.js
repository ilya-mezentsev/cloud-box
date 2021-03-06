import { registerUser } from '../registration';
import * as request from '../../shared/request';
import { API_STATUS, ErrorResponse, SuccessResponse } from '../../shared';

jest.mock('../../shared/request');

describe('user registration tests', () => {
    it('user registration success', async () => {
        const d = { mail: 'mail@ya.ru', password: 'some-password' };
        // noinspection JSValidateTypes
        request.POST = jest.fn().mockResolvedValue({
            status: API_STATUS.OK,
        });

        const res = await registerUser(d);

        expect(request.POST).toBeCalledWith({
            path: 'registration/user',
            body: d,
        });
        expect(res).toBeInstanceOf(SuccessResponse);
        expect(res.isOk()).toBeTruthy();
        expect(res.data()).toBeNull();
    });

    it('user registration error', async () => {
        const d = { mail: 'mail@ya.ru', password: 'some-password' };
        // noinspection JSValidateTypes
        request.POST = jest.fn().mockResolvedValue({
            status: API_STATUS.ERROR,
            data: 'some-error',
        });

        const res = await registerUser(d);

        expect(request.POST).toBeCalledWith({
            path: 'registration/user',
            body: d,
        });
        expect(res).toBeInstanceOf(ErrorResponse);
        expect(res.isOk()).toBeFalsy();
        expect(res.data()).toEqual('some-error');
    });
});
