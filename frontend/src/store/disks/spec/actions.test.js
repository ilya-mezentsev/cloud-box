import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as boxAPI from '../../../services/box';
import { SuccessResponse, ErrorResponse } from '../../../services/shared';
import { fetchDisks } from '../actions';
import { ACTIONS } from '../actionTypes';

jest.mock('../../../services/box');

const middlewares = [thunk];
// noinspection JSValidateTypes
const mockStore = configureMockStore(middlewares);

describe('disks api actions tests', () => {
    it('fetch disks success', async () => {
        const d = {tunnelDomain: 'www.google.com', boxUUID: 'box-uuid'};
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.getDisks = jest.fn().mockResolvedValue(new SuccessResponse(['d1', 'd2']));

        await store.dispatch(fetchDisks(d));

        expect(boxAPI.getDisks).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.SET_DISKS,
                disks: ['d1', 'd2'],
            },
        ]);
    });

    it('fetch disks error (box error)', async () => {
        const d = {tunnelDomain: 'www.google.com', boxUUID: 'box-uuid'};
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.getDisks = jest.fn().mockResolvedValue(new ErrorResponse('some-error'));

        await store.dispatch(fetchDisks(d));

        expect(boxAPI.getDisks).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_FETCH_DISKS,
                error: 'some-error',
            },
        ]);
    });

    it('fetch disks error (unknown error)', async () => {
        const d = {tunnelDomain: 'www.google.com', boxUUID: 'box-uuid'};
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.getDisks = jest.fn().mockRejectedValue('some-error');

        await store.dispatch(fetchDisks(d));

        expect(boxAPI.getDisks).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_PERFORM_DISKS_ACTION,
                error: 'some-error',
            },
        ]);
    });
});
