import { createFile, getFile, deleteFile, renameFile } from '../file';
import * as request from '../../shared/request';
import mime from 'mime-types';
import { makeBoxRequestHeaders } from '../shared';
import { API_STATUS, ErrorResponse, SuccessResponse } from '../../shared';

jest.mock('../../shared/request');

describe('file tests', () => {
    it('get file success', () => {
        expect(getFile({
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            filePath: 'foo/bar',
            boxUUID: 'some-uuid'
        })).toEqual('www.google.com/file?file_path=foo/bar&disk_name=disk_name')
    });

    it('create file success', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            folderPath: 'foo/bar',
            file: new File([], 'foo.txt'),
            boxUUID: 'some-uuid',
        };
        // noinspection JSValidateTypes
        request.POST = jest.fn().mockResolvedValue({
            statue: API_STATUS.OK,
        });

        const fd = buildFormDataForCreatingFile(d);

        const res = await createFile(d);

        expect(request.POST).toBeCalledWith({
            absolutePath: d.tunnelDomain,
            path: 'file',
            body: fd,
            contentType: mime.lookup(d.file.name) || 'application/octet-stream',
            headers: makeBoxRequestHeaders({
                boxUUID: d.boxUUID,
            }),
        });
        expect(res).toBeInstanceOf(SuccessResponse);
        expect(res.isOk()).toBeTruthy();
        expect(res.data()).toBeNull();
    });

    it('create file error', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            folderPath: 'foo/bar',
            file: new File([], 'foo'),
            boxUUID: 'some-uuid',
        };
        // noinspection JSValidateTypes
        request.POST = jest.fn().mockResolvedValue({
            status: API_STATUS.ERROR,
            data: 'some-error',
        });

        const fd = buildFormDataForCreatingFile(d);

        const res = await createFile(d);

        expect(request.POST).toBeCalledWith({
            absolutePath: d.tunnelDomain,
            path: 'file',
            body: fd,
            contentType: mime.lookup(d.file.name) || 'application/octet-stream',
            headers: makeBoxRequestHeaders({
                boxUUID: d.boxUUID,
            }),
        });
        expect(res).toBeInstanceOf(ErrorResponse);
        expect(res.isOk()).toBeFalsy();
        expect(res.data()).toEqual('some-error');
    });

    it('rename file success', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            folderPath: 'foo/bar',
            oldName: 'baz',
            newName: 'baz2',
            boxUUID: 'some-uuid',
        };
        // noinspection JSValidateTypes
        request.PATCH = jest.fn().mockResolvedValue({
            status: API_STATUS.OK,
        });

        const res = await renameFile(d);

        expect(request.PATCH).toBeCalledWith({
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
        expect(res).toBeInstanceOf(SuccessResponse);
        expect(res.isOk()).toBeTruthy();
        expect(res.data()).toBeNull();
    });

    it('rename file error', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            folderPath: 'foo/bar',
            oldName: 'baz',
            newName: 'baz2',
            boxUUID: 'some-uuid',
        };
        // noinspection JSValidateTypes
        request.PATCH = jest.fn().mockResolvedValue({
            status: API_STATUS.ERROR,
            data: 'some-error'
        });

        const res = await renameFile(d);

        expect(request.PATCH).toBeCalledWith({
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
        expect(res).toBeInstanceOf(ErrorResponse);
        expect(res.isOk()).toBeFalsy();
        expect(res.data()).toEqual('some-error');
    });

    it('delete file success', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            filePath: 'foo/bar/baz.txt',
            boxUUID: 'some-uuid',
        };
        // noinspection JSValidateTypes
        request.DELETE = jest.fn().mockResolvedValue({
            status: API_STATUS.OK,
        });

        const res = await deleteFile(d);

        expect(request.DELETE).toBeCalledWith({
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
        expect(res).toBeInstanceOf(SuccessResponse);
        expect(res.isOk()).toBeTruthy();
        expect(res.data()).toBeNull();
    });

    it('delete file error', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            filePath: 'foo/bar/baz.txt',
            boxUUID: 'some-uuid',
        };
        // noinspection JSValidateTypes
        request.DELETE = jest.fn().mockResolvedValue({
            status: API_STATUS.ERROR,
            data: 'some-error',
        });

        const res = await deleteFile(d);

        expect(request.DELETE).toBeCalledWith({
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
        expect(res).toBeInstanceOf(ErrorResponse);
        expect(res.isOk()).toBeFalsy();
        expect(res.data()).toEqual('some-error');
    });
});

const buildFormDataForCreatingFile = d => {
    const fd = new FormData();
    fd.append('disk_name', d.diskName);
    fd.append('folder_path', d.folderPath);
    fd.append('file', d.file);

    return fd;
};
