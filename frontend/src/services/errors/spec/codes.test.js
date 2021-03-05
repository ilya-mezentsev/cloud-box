import * as parser from '../';

describe('error codes parsers tests', () => {
    it('tests', () => {
        expect(parser.isCredentialsNotFoundError('foo')).toBeFalsy();
        expect(parser.isCredentialsNotFoundError('credentials-not-found')).toBeTruthy();

        expect(parser.isHashDoesNotExistsError('foo')).toBeFalsy();
        expect(parser.isHashDoesNotExistsError('hash-does-not-exist')).toBeTruthy();

        expect(parser.isMailExistsError('foo')).toBeFalsy();
        expect(parser.isMailExistsError('mail-already-exists')).toBeTruthy();

        expect(parser.isNoTokenInCookieError('foo')).toBeFalsy();
        expect(parser.isNoTokenInCookieError('no-token-in-cookie')).toBeTruthy();

        expect(parser.isValidationError('foo')).toBeFalsy();
        expect(parser.isValidationError('validation-error')).toBeTruthy();
    });
});