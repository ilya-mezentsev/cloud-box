import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as api from '../../../services/api';
import { SuccessResponse, ErrorResponse } from '../../../services/shared';
import { signIn, signOut, fetchSession } from '../actions';
import { ACTIONS } from '../actionTypes';

jest.mock('../../../services/api');

const middlewares = [thunk];
// noinspection JSValidateTypes
const mockStore = configureMockStore(middlewares);

describe('session api actions tests', () => {
    it('fetch session success', async () => {
        const hash = 'account-hash';
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        api.getSession = jest.fn().mockResolvedValue(new SuccessResponse({ hash }));

        await store.dispatch(fetchSession());

        expect(api.getSession).toBeCalled();
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.SET_SESSION,
                sessionHash: hash,
            }
        ]);
    });

    it('fetch session error (backend error)', async () => {
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        api.getSession = jest.fn().mockResolvedValue(new ErrorResponse('some-error'));

        await store.dispatch(fetchSession());

        expect(api.getSession).toBeCalled();
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_GET_SESSION,
                error: 'some-error',
            }
        ]);
    });

    it('fetch session error (unknown error)', async () => {
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        api.getSession = jest.fn().mockRejectedValue('some-error');

        await store.dispatch(fetchSession());

        expect(api.getSession).toBeCalled();
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_PERFORM_SESSION_ACTION,
                error: 'some-error',
            }
        ]);
    });

    it('sign-in success', async () => {
        const hash = 'account-hash';
        const d = {mail: 'mail@ya.ru', password: 'password'};
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        api.createSession = jest.fn().mockResolvedValue(new SuccessResponse({ hash }));

        await store.dispatch(signIn(d));

        expect(api.createSession).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.SET_SESSION,
                sessionHash: hash,
            },
        ]);
    });

    it('sign-in error (backend error)', async () => {
        const d = {mail: 'mail@ya.ru', password: 'password'};
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        api.createSession = jest.fn().mockResolvedValue(new ErrorResponse('some-error'));

        await store.dispatch(signIn(d));

        expect(api.createSession).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_CREATE_SESSION,
                error: 'some-error',
            },
        ]);
    });

    it('sign-in error (unknown error)', async () => {
        const d = {mail: 'mail@ya.ru', password: 'password'};
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        api.createSession = jest.fn().mockRejectedValue('some-error');

        await store.dispatch(signIn(d));

        expect(api.createSession).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_PERFORM_SESSION_ACTION,
                error: 'some-error',
            },
        ]);
    });

    it('sign-out success', async () => {
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        api.deleteSession = jest.fn().mockResolvedValue(new SuccessResponse());

        await store.dispatch(signOut());

        expect(api.deleteSession).toBeCalled();
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.UNSET_SESSION,
            },
        ]);
    });

    it('sign-out error (backend error)', async () => {
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        api.deleteSession = jest.fn().mockResolvedValue(new ErrorResponse('some-error'));

        await store.dispatch(signOut());

        expect(api.deleteSession).toBeCalled();
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_DELETE_SESSION,
                error: 'some-error',
            },
        ]);
    });

    it('sign-out error (unknown error)', async () => {
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        api.deleteSession = jest.fn().mockRejectedValue('some-error');

        await store.dispatch(signOut());

        expect(api.deleteSession).toBeCalled();
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_PERFORM_SESSION_ACTION,
                error: 'some-error',
            },
        ]);
    });
});
