import { createFile, getFile, deleteFile, renameFile } from '../file';
import * as shared from '../../shared';
import mime from 'mime-types';
import { makeBoxRequestHeaders } from '../shared';

jest.mock('../../shared');

describe('file tests', () => {
    it('get file test', () => {
        expect(getFile({
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            filePath: 'foo/bar',
            boxUUID: 'some-uuid'
        })).toEqual('www.google.com/file?file_path=foo/bar&disk_name=disk_name')
    });

    it('create file test', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            folderPath: 'foo/bar',
            file: new File([], 'foo.txt'),
            boxUUID: 'some-uuid',
        };
        const fd = new FormData();
        fd.append('disk_name', d.diskName);
        fd.append('folder_path', d.folderPath);
        fd.append('file', d.file);

        await createFile(d);

        expect(shared.POST).toBeCalledWith({
            absolutePath: d.tunnelDomain,
            path: 'file',
            body: fd,
            contentType: mime.lookup(d.file.name) || 'application/octet-stream',
            headers: makeBoxRequestHeaders({
                boxUUID: d.boxUUID,
            }),
        });
        expect(shared.errorResponseOrDefault).toBeCalled();
    });

    it('rename file test', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            folderPath: 'foo/bar',
            oldName: 'baz',
            newName: 'baz2',
            boxUUID: 'some-uuid',
        };

        await renameFile(d);

        expect(shared.PATCH).toBeCalledWith({
            absolutePath: d.tunnelDomain,
            path: 'file',
            body: {
                disk_name: d.diskName,
                folder_path: d.folderPath,
                old_name: d.oldName,
                new_name: d.newName,
            },
            headers: makeBoxRequestHeaders({
                boxUUID: d.boxUUID,
            }),
        });
        expect(shared.errorResponseOrDefault).toBeCalled();
    });

    it('delete file test', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            filePath: 'foo/bar/baz.txt',
            boxUUID: 'some-uuid',
        };

        await deleteFile(d);

        expect(shared.DELETE).toBeCalledWith({
            absolutePath: d.tunnelDomain,
            path: 'file',
            params: {
                disk_name: d.diskName,
                file_path: d.filePath,
            },
            headers: makeBoxRequestHeaders({
                boxUUID: d.boxUUID,
            }),
        });
        expect(shared.errorResponseOrDefault).toBeCalled();
    });
});
