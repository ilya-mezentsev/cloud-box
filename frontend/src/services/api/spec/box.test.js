import { fetchBoxes, bindBox, AccountBoxesResponse } from '../box';
import * as request from '../../shared/request';
import { API_STATUS, ErrorResponse, SuccessResponse } from '../../shared';

jest.mock('../../shared/request');

describe('box api tests', () => {
    it('fetch boxes success', async () => {
        const d = {
            tunnel_domain: 'www.google.com',
            uuid: 'some-uuid',
            alias: 'alias',
        };
        // noinspection JSValidateTypes
        request.GET = jest.fn().mockResolvedValue({
            status: API_STATUS.OK,
            data: [ d ],
        });

        const res = await fetchBoxes('some-hash');

        expect(request.GET).toBeCalledWith({
            path: 'boxes/some-hash',
        });
        expect(res).toBeInstanceOf(AccountBoxesResponse);
        expect(res.isOk()).toBeTruthy();
        expect(res.data()).toEqual([
            {
                tunnelDomain: d.tunnel_domain,
                uuid: d.uuid,
                alias: d.alias,
            },
        ]);
    });

    it('fetch boxes error', async () => {
        // noinspection JSValidateTypes
        request.GET = jest.fn().mockResolvedValue({
            status: API_STATUS.ERROR,
            data: 'some-error',
        });

        const res = await fetchBoxes('some-hash');

        expect(request.GET).toBeCalledWith({
            path: 'boxes/some-hash',
        });
        expect(res).toBeInstanceOf(ErrorResponse);
        expect(res.isOk()).toBeFalsy();
        expect(res.data()).toEqual('some-error');
    });

    it('bind box success', async () => {
        const d = {
            accountHash: 'some-hash',
            boxUUID: 'some-uuid',
            alias: 'alias',
        };
        // noinspection JSValidateTypes
        request.POST = jest.fn().mockResolvedValue({
            status: API_STATUS.OK
        });

        const res = await bindBox(d);

        expect(request.POST).toBeCalledWith({
            path: 'box',
            body: {
                account_hash: d.accountHash,
                uuid: d.boxUUID,
                alias: d.alias,
            },
        });
        expect(res).toBeInstanceOf(SuccessResponse);
        expect(res.isOk()).toBeTruthy();
        expect(res.data()).toBeNull();
    });

    it('bind box error', async () => {
        const d = {
            accountHash: 'some-hash',
            boxUUID: 'some-uuid',
            alias: 'alias',
        };
        // noinspection JSValidateTypes
        request.POST = jest.fn().mockResolvedValue({
            status: API_STATUS.ERROR,
            data: 'some-error'
        });

        const res = await bindBox(d);

        expect(request.POST).toBeCalledWith({
            path: 'box',
            body: {
                account_hash: d.accountHash,
                uuid: d.boxUUID,
                alias: d.alias,
            },
        });
        expect(res).toBeInstanceOf(ErrorResponse);
        expect(res.isOk()).toBeFalsy();
        expect(res.data()).toEqual('some-error');
    });
});
