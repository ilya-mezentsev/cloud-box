import { getDisks, DisksResponse } from '../disks';
import * as request from '../../shared/request';
import { makeBoxRequestHeaders } from '../shared';
import { API_STATUS, ErrorResponse } from '../../shared';

jest.mock('../../shared/request');

describe('disks tests', () => {
    it('get disks success', async () => {
        const d = {tunnelDomain: 'www.google.com', boxUUID: 'some-uuid'};
        // noinspection JSValidateTypes
        request.GET = jest.fn().mockResolvedValue({
            status: API_STATUS.OK,
            data: ['d1', 'd2'],
        });

        const res = await getDisks(d);

        expect(request.GET).toBeCalledWith({
            absolutePath: d.tunnelDomain,
            path: 'disks',
            headers: makeBoxRequestHeaders({
                boxUUID: d.boxUUID,
            }),
        });
        expect(res).toBeInstanceOf(DisksResponse);
        expect(res.isOk()).toBeTruthy();
        expect(res.data()).toEqual(['d1', 'd2']);
    });

    it('get disks error', async () => {
        const d = {tunnelDomain: 'www.google.com', boxUUID: 'some-uuid'};
        // noinspection JSValidateTypes
        request.GET = jest.fn().mockResolvedValue({
            status: API_STATUS.ERROR,
            data: 'some-error',
        });

        const res = await getDisks(d);

        expect(request.GET).toBeCalledWith({
            absolutePath: d.tunnelDomain,
            path: 'disks',
            headers: makeBoxRequestHeaders({
                boxUUID: d.boxUUID,
            }),
        });
        expect(res).toBeInstanceOf(ErrorResponse);
        expect(res.isOk()).toBeFalsy();
        expect(res.data()).toEqual('some-error');
    });
});
