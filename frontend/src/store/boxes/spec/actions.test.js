import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as api from '../../../services/api';
import { SuccessResponse, ErrorResponse } from '../../../services/shared';
import { fetchBoxes, bindBox } from '../actions';
import { ACTIONS } from '../actionTypes';

jest.mock('../../../services/api');

const middlewares = [thunk];
// noinspection JSValidateTypes
const mockStore = configureMockStore(middlewares);

describe('box api actions tests', () => {
    it('fetch boxes success', async () => {
        const hash = 'account-hash';
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        api.fetchBoxes = jest.fn().mockResolvedValue(new SuccessResponse('some-data'));

        await store.dispatch(fetchBoxes(hash));

        expect(api.fetchBoxes).toBeCalledWith(hash);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.SET_BOXES,
                boxes: 'some-data',
            },
        ]);
    });

    it('fetch boxes error (backend error)', async () => {
        const hash = 'account-hash';
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        api.fetchBoxes = jest.fn().mockResolvedValue(new ErrorResponse('some-error'));

        await store.dispatch(fetchBoxes(hash));

        expect(api.fetchBoxes).toBeCalledWith(hash);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_FETCH_BOXES,
                error: 'some-error',
            },
        ]);
    });

    it('fetch boxes error (unknown error)', async () => {
        const hash = 'account-hash';
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        api.fetchBoxes = jest.fn().mockRejectedValue('some-error');

        await store.dispatch(fetchBoxes(hash));

        expect(api.fetchBoxes).toBeCalledWith(hash);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_PERFORM_BOXES_ACTION,
                error: 'some-error',
            },
        ]);
    });

    it('bind box success', async () => {
        const d = {accountHash: 'account-hash', boxUUID: 'box-uuid', alias: 'alias'};
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        api.bindBox = jest.fn().mockResolvedValue(new SuccessResponse());

        await store.dispatch(bindBox(d));

        expect(api.bindBox).toBeCalledWith(d);
        expect(store.getActions()).toEqual([]);
    });

    it('bind box error (backend error)', async () => {
        const d = {accountHash: 'account-hash', boxUUID: 'box-uuid', alias: 'alias'};
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        api.bindBox = jest.fn().mockResolvedValue(new ErrorResponse('some-error'));

        await store.dispatch(bindBox(d));

        expect(api.bindBox).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_BIND_BOX,
                error: 'some-error',
            },
        ]);
    });

    it('bind box error (unknown error)', async () => {
        const d = {accountHash: 'account-hash', boxUUID: 'box-uuid', alias: 'alias'};
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        api.bindBox = jest.fn().mockRejectedValue('some-error');

        await store.dispatch(bindBox(d));

        expect(api.bindBox).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_PERFORM_BOXES_ACTION,
                error: 'some-error',
            },
        ]);
    });
});
