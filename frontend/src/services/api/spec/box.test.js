import { fetchBoxes, bindBox } from '../box';
import * as shared from '../../shared';

jest.mock('../../shared');

describe('box api tests', () => {
    it('check fetchBoxes', async () => {
        await fetchBoxes('some-hash');

        expect(shared.GET).toBeCalledWith({
            path: 'boxes/some-hash',
        });
        expect(shared.errorResponseOr).toBeCalled();
    });

    it('check bindBox', async () => {
        const d = {
            accountHash: 'some-hash',
            boxUUID: 'some-uuid',
            alias: 'alias',
        };
        await bindBox(d);

        expect(shared.POST).toBeCalledWith({
            path: 'box',
            body: {
                account_hash: d.accountHash,
                uuid: d.boxUUID,
                alias: d.alias,
            },
        });
        expect(shared.errorResponseOrDefault).toBeCalled();
    });
});
