import { getDisks } from '../disks';
import * as shared from '../../shared';
import { makeBoxRequestHeaders } from '../shared';

jest.mock('../../shared');

describe('disks tests', () => {
    it('get disks test', async () => {
        const d = {tunnelDomain: 'www.google.com', boxUUID: 'some-uuid'};

        await getDisks(d);

        expect(shared.GET).toBeCalledWith({
            absolutePath: d.tunnelDomain,
            path: 'disks',
            headers: makeBoxRequestHeaders({
                boxUUID: d.boxUUID,
            }),
        });
        expect(shared.errorResponseOr).toBeCalled();
    });
});
