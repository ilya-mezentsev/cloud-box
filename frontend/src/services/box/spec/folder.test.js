import { createFolder, getFolder, deleteFolder, renameFolder } from '../folder';
import * as shared from '../../shared';
import { makeBoxRequestHeaders } from '../shared';

jest.mock('../../shared');

describe('folder tests', () => {
    it('get folder test', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            folderPath: 'foo/bar',
            diskName: 'disk_name',
            boxUUID: 'some-uuid',
        };

        await getFolder(d);

        expect(shared.GET).toBeCalledWith({
            absolutePath: d.tunnelDomain,
            path: 'folder',
            params: {
                folder_path: d.folderPath,
                disk_name: d.diskName,
            },
            headers: makeBoxRequestHeaders({
                boxUUID: d.boxUUID,
            }),
        });
        expect(shared.errorResponseOr).toBeCalled();
    });

    it('create folder test', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            rootPath: '',
            folderName: 'foo',
            boxUUID: 'some-uuid',
        };

        await createFolder(d);

        expect(shared.POST).toBeCalledWith({
            absolutePath: d.tunnelDomain,
            path: 'folder',
            body: {
                disk_name: d.diskName,
                root_path: d.rootPath,
                folder_name: d.folderName,
            },
            headers: makeBoxRequestHeaders({
                boxUUID: d.boxUUID,
            }),
        });
        expect(shared.errorResponseOrDefault).toBeCalled();
    });

    it('rename folder test', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            rootPath: 'foo/bar',
            oldName: 'baz',
            newName: 'xyz',
            boxUUID: 'some-uuid',
        };

        await renameFolder(d);

        expect(shared.PATCH).toBeCalledWith({
            absolutePath: d.tunnelDomain,
            path: 'folder',
            body: {
                disk_name: d.diskName,
                folder_path: d.rootPath,
                old_name: d.oldName,
                new_name: d.newName,
            },
            headers: makeBoxRequestHeaders({
                boxUUID: d.boxUUID,
            }),
        });
        expect(shared.errorResponseOrDefault).toBeCalled();
    });

    it('delete folder test', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            folderPath: 'foo/bar/baz',
            boxUUID: 'some-uuid',
        };

        await deleteFolder(d);

        expect(shared.DELETE).toBeCalledWith({
            absolutePath: d.tunnelDomain,
            path: 'folder',
            params: {
                disk_name: d.diskName,
                folder_path: d.folderPath,
            },
            headers: makeBoxRequestHeaders({
                boxUUID: d.boxUUID,
            }),
        });
        expect(shared.errorResponseOrDefault).toBeCalled();
    });
});
