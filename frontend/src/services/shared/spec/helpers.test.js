import { removeLeadingAndTrailingSlashes, buildQueryParams } from '../helpers';

describe('request helpers tests', () => {
    it('remove slashes', () => {
        const _ = removeLeadingAndTrailingSlashes;

        expect(_('/foo/bar/')).toEqual('foo/bar');
        expect(_('///////////foo/bar')).toEqual('foo/bar');
        expect(_('foo/bar///////////////')).toEqual('foo/bar');
        expect(_('foo/bar')).toEqual('foo/bar');
        expect(_('//////foo/bar//////')).toEqual('foo/bar')
    });

    it('build query params', () => {
        const _ = buildQueryParams;

        expect(_({foo: 'bar'})).toEqual('foo=bar');
        expect(_({foo: 'bar', baz: 'foo'})).toEqual('foo=bar&baz=foo');
    });
});
