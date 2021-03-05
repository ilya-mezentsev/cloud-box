import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as api from '../../../services/api';
import { SuccessResponse, ErrorResponse } from '../../../services/shared';
import { signUp } from '../actions';
import { ACTIONS } from '../actionTypes';

jest.mock('../../../services/api');

const middlewares = [thunk];
// noinspection JSValidateTypes
const mockStore = configureMockStore(middlewares);

describe('registration action tests', () => {
    it('successful registration', async () => {
        const d = {mail: 'mail@ya.ru', password: 'password'};
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        api.registerUser = jest.fn().mockResolvedValue(new SuccessResponse());

        await store.dispatch(signUp(d));

        expect(api.registerUser).toBeCalledWith(d);
        expect(store.getActions()).toEqual([]);
    });

    it('failed registration (error response)', async () => {
        const d = {mail: 'mail@ya.ru', password: 'password'};
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        api.registerUser = jest.fn().mockResolvedValue(new ErrorResponse('foo'));

        await store.dispatch(signUp(d));

        expect(api.registerUser).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_REGISTER_USER,
                error: 'foo',
            },
        ]);
    });

    it('failed registration (unknown error)', async () => {
        const d = {mail: 'mail@ya.ru', password: 'password'};
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        api.registerUser = jest.fn().mockRejectedValue('foo');

        await store.dispatch(signUp(d));

        expect(api.registerUser).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_PERFORM_REGISTER_ACTION,
                error: 'foo',
            },
        ]);
    });
});
