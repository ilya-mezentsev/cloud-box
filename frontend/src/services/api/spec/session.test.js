import { createSession, getSession, deleteSession } from '../session';
import * as shared from '../../shared';

jest.mock('../../shared');

describe('session tests', () => {
    it('create session test', async () => {
        const d = {mail: 'mail@ya.ru', password: 'some-password'};

        await createSession(d);

        expect(shared.POST).toBeCalledWith({
            path: 'session',
            body: d,
        });
        expect(shared.errorResponseOr).toBeCalled();
    });

    it('get session test', async () => {
        await getSession();

        expect(shared.GET).toBeCalledWith({
            path: 'session',
        });
        expect(shared.errorResponseOr).toBeCalled();
    });

    it('delete session test', async () => {
        await deleteSession();

        expect(shared.DELETE).toBeCalledWith({
            path: 'session',
        });
        expect(shared.errorResponseOrDefault).toBeCalled();
    });
});
