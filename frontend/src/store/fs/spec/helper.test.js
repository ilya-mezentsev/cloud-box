import { buildPath, folderPathFromFilePath, filenameFromFilePath } from '../helper';

describe('fs helpers tests', () => {
    it('build path with components', () => {
        expect(buildPath({
            boxUUID: 'some-uuid',
            diskName: 'disk_name',
            components: ['foo/', '/bar'],
        })).toEqual('some-uuid:/disk_name/foo/bar');
    });

    it('build path without components', () => {
        expect(buildPath({
            boxUUID: 'some-uuid',
            diskName: 'disk_name',
            components: [],
        })).toEqual('some-uuid:/disk_name/');
    });

    it('folder path from file path', () => {
        expect(folderPathFromFilePath({
            boxUUID: 'some-uuid',
            diskName: 'disk_name',
            filePath: '/home/user/foo/bar.txt',
        })).toEqual('some-uuid:/disk_name/home/user/foo');
    });

    it('folder path from file path without extension', () => {
        expect(folderPathFromFilePath({
            boxUUID: 'some-uuid',
            diskName: 'disk_name',
            filePath: 'home/user/foo/bar',
        })).toEqual('some-uuid:/disk_name/home/user/foo');
    });

    it('filename from file path', () => {
        expect(filenameFromFilePath('/home/user/foo/bar.txt')).toEqual('bar.txt');
    });

    it('filename from file path (root)', () => {
        expect(filenameFromFilePath('/file.txt')).toEqual('file.txt');
    });
});
