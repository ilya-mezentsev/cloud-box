import {createSession, getSession, deleteSession, SessionResponse} from '../session';
import * as request from '../../shared/request';
import { API_STATUS, ErrorResponse, SuccessResponse } from '../../shared';

jest.mock('../../shared/request');

describe('session api tests', () => {
    it('create session success', async () => {
        const r = { hash: 'some-hash' };
        const d = { mail: 'mail@ya.ru', password: 'some-password' };
        // noinspection JSValidateTypes
        request.POST = jest.fn().mockResolvedValue({
            status: API_STATUS.OK,
            data: r,
        });

        const res = await createSession(d);

        expect(request.POST).toBeCalledWith({
            path: 'session',
            body: d,
        });
        expect(res).toBeInstanceOf(SessionResponse);
        expect(res.isOk()).toBeTruthy();
        expect(res.data()).toEqual(r);
    });

    it('create session error', async () => {
        const d = { mail: 'mail@ya.ru', password: 'some-password' };
        // noinspection JSValidateTypes
        request.POST = jest.fn().mockResolvedValue({
            status: API_STATUS.ERROR,
            data: 'some-error',
        });

        const res = await createSession(d);

        expect(request.POST).toBeCalledWith({
            path: 'session',
            body: d,
        });
        expect(res).toBeInstanceOf(ErrorResponse);
        expect(res.isOk()).toBeFalsy();
        expect(res.data()).toEqual('some-error');
    });

    it('get session success', async () => {
        const r = { hash: 'some-hash' };
        // noinspection JSValidateTypes
        request.GET = jest.fn().mockResolvedValue({
            status: API_STATUS.OK,
            data: r,
        });

        const res = await getSession();

        expect(request.GET).toBeCalledWith({
            path: 'session',
        });
        expect(res).toBeInstanceOf(SessionResponse);
        expect(res.isOk()).toBeTruthy();
        expect(res.data()).toEqual(r);
    });

    it('get session error', async () => {
        // noinspection JSValidateTypes
        request.GET = jest.fn().mockResolvedValue({
            status: API_STATUS.ERROR,
            data: 'some-error',
        });

        const res = await getSession();

        expect(request.GET).toBeCalledWith({
            path: 'session',
        });
        expect(res).toBeInstanceOf(ErrorResponse);
        expect(res.isOk()).toBeFalsy();
        expect(res.data()).toEqual('some-error');
    });

    it('delete session test', async () => {
        // noinspection JSValidateTypes
        request.DELETE = jest.fn().mockResolvedValue({
            status: API_STATUS.OK,
        });

        const res = await deleteSession();

        expect(request.DELETE).toBeCalledWith({
            path: 'session',
        });
        expect(res).toBeInstanceOf(SuccessResponse);
        expect(res.isOk()).toBeTruthy();
        expect(res.data()).toBeNull();
    });
});
