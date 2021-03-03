import { registerUser } from '../registration';
import * as shared from '../../shared';

jest.mock('../../shared');

describe('user registration tests', () => {
    it('user registration test', async () => {
        const d = {mail: 'mail@ya.ru', password: 'some-password'};

        await registerUser(d);

        expect(shared.POST).toBeCalledWith({
            path: 'registration/user',
            body: d,
        });
        expect(shared.errorResponseOrDefault).toBeCalled();
    });
});
