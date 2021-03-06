import { createFolder, getFolder, deleteFolder, renameFolder, FolderResponse } from '../folder';
import * as request from '../../shared/request';
import { makeBoxRequestHeaders } from '../shared';
import { API_STATUS, ErrorResponse, SuccessResponse } from '../../shared';

jest.mock('../../shared/request');

describe('folder tests', () => {
    it('get folder success', async () => {
        const r = {
            path: 'foo/bar',
            nodes: [
                {
                    node_type: 'file',
                    name: 'baz.txt'
                },
            ],
        };
        const d = {
            tunnelDomain: 'www.google.com',
            folderPath: 'foo/bar',
            diskName: 'disk_name',
            boxUUID: 'some-uuid',
        };
        // noinspection JSValidateTypes
        request.GET = jest.fn().mockResolvedValue({
            status: API_STATUS.OK,
            data: r,
        });

        const res = await getFolder(d);

        expect(request.GET).toBeCalledWith({
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
        expect(res).toBeInstanceOf(FolderResponse);
        expect(res.isOk()).toBeTruthy();
        expect(res.data()).toEqual({
            path: r.path,
            nodes: [
                {
                    nodeType: 'file',
                    name: 'baz.txt',
                },
            ],
        });
    });

    it('get folder error', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            folderPath: 'foo/bar',
            diskName: 'disk_name',
            boxUUID: 'some-uuid',
        };
        // noinspection JSValidateTypes
        request.GET = jest.fn().mockResolvedValue({
            status: API_STATUS.ERROR,
            data: 'some-error',
        });

        const res = await getFolder(d);

        expect(request.GET).toBeCalledWith({
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
        expect(res).toBeInstanceOf(ErrorResponse);
        expect(res.isOk()).toBeFalsy();
        expect(res.data()).toEqual('some-error');
    });

    it('create folder success', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            rootPath: '',
            folderName: 'foo',
            boxUUID: 'some-uuid',
        };
        // noinspection JSValidateTypes
        request.POST = jest.fn().mockResolvedValue({
            status: API_STATUS.OK,
        });

        const res = await createFolder(d);

        expect(request.POST).toBeCalledWith({
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
        expect(res).toBeInstanceOf(SuccessResponse);
        expect(res.isOk()).toBeTruthy();
        expect(res.data()).toBeNull();
    });

    it('create folder error', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            rootPath: '',
            folderName: 'foo',
            boxUUID: 'some-uuid',
        };
        // noinspection JSValidateTypes
        request.POST = jest.fn().mockResolvedValue({
            status: API_STATUS.ERROR,
            data: 'some-error',
        });

        const res = await createFolder(d);

        expect(request.POST).toBeCalledWith({
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
        expect(res).toBeInstanceOf(ErrorResponse);
        expect(res.isOk()).toBeFalsy();
        expect(res.data()).toEqual('some-error');
    });

    it('rename folder success', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            rootPath: 'foo/bar',
            oldName: 'baz',
            newName: 'xyz',
            boxUUID: 'some-uuid',
        };
        // noinspection JSValidateTypes
        request.PATCH = jest.fn().mockResolvedValue({
            status: API_STATUS.OK,
        });

        const res = await renameFolder(d);

        expect(request.PATCH).toBeCalledWith({
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
        expect(res).toBeInstanceOf(SuccessResponse);
        expect(res.isOk()).toBeTruthy();
        expect(res.data()).toBeNull();
    });

    it('rename folder error', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            rootPath: 'foo/bar',
            oldName: 'baz',
            newName: 'xyz',
            boxUUID: 'some-uuid',
        };
        // noinspection JSValidateTypes
        request.PATCH = jest.fn().mockResolvedValue({
            status: API_STATUS.ERROR,
            data: 'some-error',
        });

        const res = await renameFolder(d);

        expect(request.PATCH).toBeCalledWith({
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
        expect(res).toBeInstanceOf(ErrorResponse);
        expect(res.isOk()).toBeFalsy();
        expect(res.data()).toEqual('some-error');
    });

    it('delete folder success', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            folderPath: 'foo/bar/baz',
            boxUUID: 'some-uuid',
        };
        // noinspection JSValidateTypes
        request.DELETE = jest.fn().mockResolvedValue({
            status: API_STATUS.OK,
        });

        const res = await deleteFolder(d);

        expect(request.DELETE).toBeCalledWith({
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
        expect(res).toBeInstanceOf(SuccessResponse);
        expect(res.isOk()).toBeTruthy();
        expect(res.data()).toBeNull();
    });

    it('delete folder error', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            folderPath: 'foo/bar/baz',
            boxUUID: 'some-uuid',
        };
        // noinspection JSValidateTypes
        request.DELETE = jest.fn().mockResolvedValue({
            status: API_STATUS.ERROR,
            data: 'some-error',
        });

        const res = await deleteFolder(d);

        expect(request.DELETE).toBeCalledWith({
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
        expect(res).toBeInstanceOf(ErrorResponse);
        expect(res.isOk()).toBeFalsy();
        expect(res.data()).toEqual('some-error');
    });
});
