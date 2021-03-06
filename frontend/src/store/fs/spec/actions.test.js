import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as boxAPI from '../../../services/box';
import { SuccessResponse, ErrorResponse } from '../../../services/shared';
import {
    getFolder,
    createFolder,
    renameFolder,
    deleteFolder,

    getFile,
    createFile,
    renameFile,
    deleteFile,
} from '../actions';
import { ACTIONS } from '../actionTypes';

jest.mock('../../../services/box');

const middlewares = [thunk];
// noinspection JSValidateTypes
const mockStore = configureMockStore(middlewares);

describe('fs api actions tests', () => {
    it('get folder success', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            folderPath: 'foo/bar',
            diskName: 'disk_name',
            boxUUID: 'box-uuid',
        };
        const nodes = ['n1', 'n2'];
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.getFolder = jest.fn().mockResolvedValue(new SuccessResponse({ nodes }));

        await store.dispatch(getFolder(d));

        expect(boxAPI.getFolder).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.SET_FOLDER,
                folderData: {
                    nodes,
                    folderPath: d.folderPath,
                    diskName: d.diskName,
                    boxUUID: d.boxUUID,
                },
            },
        ]);
    });

    it('get folder error (backend error)', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            folderPath: 'foo/bar',
            diskName: 'disk_name',
            boxUUID: 'box-uuid',
        };
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.getFolder = jest.fn().mockResolvedValue(new ErrorResponse('some-error'));

        await store.dispatch(getFolder(d));

        expect(boxAPI.getFolder).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_FETCH_FOLDER,
                error: 'some-error',
            },
        ]);
    });

    it('get folder error (unknown error)', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            folderPath: 'foo/bar',
            diskName: 'disk_name',
            boxUUID: 'box-uuid',
        };
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.getFolder = jest.fn().mockRejectedValue('some-error');

        await store.dispatch(getFolder(d));

        expect(boxAPI.getFolder).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_PERFORM_FS_ACTION,
                error: 'some-error',
            },
        ]);
    });

    it('create folder success', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            rootPath: 'foo/bar',
            folderName: 'baz',
            boxUUID: 'some-uuid',
        };
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.createFolder = jest.fn().mockResolvedValue(new SuccessResponse());

        await store.dispatch(createFolder(d));

        expect(boxAPI.createFolder).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.CREATE_FOLDER,
                folderData: {
                    diskName: d.diskName,
                    rootPath: d.rootPath,
                    folderName: d.folderName,
                    boxUUID: d.boxUUID,
                },
            },
        ]);
    });

    it('create folder error (backend error)', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            rootPath: 'foo/bar',
            folderName: 'baz',
            boxUUID: 'some-uuid',
        };
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.createFolder = jest.fn().mockResolvedValue(new ErrorResponse('some-error'));

        await store.dispatch(createFolder(d));

        expect(boxAPI.createFolder).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_CREATE_FOLDER,
                error: 'some-error',
            },
        ]);
    });

    it('create folder error (unknown error)', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            rootPath: 'foo/bar',
            folderName: 'baz',
            boxUUID: 'some-uuid',
        };
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.createFolder = jest.fn().mockRejectedValue('some-error');

        await store.dispatch(createFolder(d));

        expect(boxAPI.createFolder).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_PERFORM_FS_ACTION,
                error: 'some-error',
            },
        ]);
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
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.renameFolder = jest.fn().mockResolvedValue(new SuccessResponse());

        await store.dispatch(renameFolder(d));

        expect(boxAPI.renameFolder).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.RENAME_FOLDER,
                folderData: {
                    diskName: d.diskName,
                    rootPath: d.rootPath,
                    oldName: d.oldName,
                    newName: d.newName,
                    boxUUID: d.boxUUID,
                },
            },
        ]);
    });

    it('rename folder error (backend error)', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            rootPath: 'foo/bar',
            oldName: 'baz',
            newName: 'xyz',
            boxUUID: 'some-uuid',
        };
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.renameFolder = jest.fn().mockResolvedValue(new ErrorResponse('some-error'));

        await store.dispatch(renameFolder(d));

        expect(boxAPI.renameFolder).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_RENAME_FOLDER,
                error: 'some-error',
            },
        ]);
    });

    it('rename folder error (unknown error)', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            rootPath: 'foo/bar',
            oldName: 'baz',
            newName: 'xyz',
            boxUUID: 'some-uuid',
        };
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.renameFolder = jest.fn().mockRejectedValue('some-error');

        await store.dispatch(renameFolder(d));

        expect(boxAPI.renameFolder).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_PERFORM_FS_ACTION,
                error: 'some-error',
            },
        ]);
    });

    it('delete folder success', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            folderPath: 'foo/bar',
            boxUUID: 'some-uuid',
        };
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.deleteFolder = jest.fn().mockResolvedValue(new SuccessResponse());

        await store.dispatch(deleteFolder(d));

        expect(boxAPI.deleteFolder).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.DELETE_FOLDER,
                folderData: {
                    diskName: d.diskName,
                    folderPath: d.folderPath,
                    boxUUID: d.boxUUID,
                },
            },
        ]);
    });

    it('delete folder error (backend error)', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            folderPath: 'foo/bar',
            boxUUID: 'some-uuid',
        };
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.deleteFolder = jest.fn().mockResolvedValue(new ErrorResponse('some-error'));

        await store.dispatch(deleteFolder(d));

        expect(boxAPI.deleteFolder).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_DELETE_FOLDER,
                error: 'some-error',
            },
        ]);
    });

    it('delete folder error (unknown error)', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            folderPath: 'foo/bar',
            boxUUID: 'some-uuid',
        };
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.deleteFolder = jest.fn().mockRejectedValue('some-error');

        await store.dispatch(deleteFolder(d));

        expect(boxAPI.deleteFolder).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_PERFORM_FS_ACTION,
                error: 'some-error',
            },
        ]);
    });

    it('get file stub', () => {
        expect(getFile()).toBeUndefined();
    });

    it('create file success', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            folderPath: 'foo/bar',
            file: new File([], 'baz.txt'),
            boxUUID: 'some-uuid',
        };
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.createFile = jest.fn().mockResolvedValue(new SuccessResponse());

        await store.dispatch(createFile(d));

        expect(boxAPI.createFile).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.CREATE_FILE,
                fileData: {
                    diskName: d.diskName,
                    folderPath: d.folderPath,
                    file: d.file,
                    boxUUID: d.boxUUID,
                },
            },
        ]);
    });

    it('create file error (backend error)', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            folderPath: 'foo/bar',
            file: new File([], 'baz.txt'),
            boxUUID: 'some-uuid',
        };
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.createFile = jest.fn().mockResolvedValue(new ErrorResponse('some-error'));

        await store.dispatch(createFile(d));

        expect(boxAPI.createFile).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_CREATE_FILE,
                error: 'some-error',
            },
        ]);
    });

    it('create file error (unknown error)', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            folderPath: 'foo/bar',
            file: new File([], 'baz.txt'),
            boxUUID: 'some-uuid',
        };
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.createFile = jest.fn().mockRejectedValue('some-error');

        await store.dispatch(createFile(d));

        expect(boxAPI.createFile).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_PERFORM_FS_ACTION,
                error: 'some-error',
            },
        ]);
    });

    it('rename file success', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            folderPath: 'foo/bar',
            oldName: 'old.txt',
            newName: 'new.txt',
            boxUUID: 'some-uuid',
        };
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.renameFile = jest.fn().mockResolvedValue(new SuccessResponse());

        await store.dispatch(renameFile(d));

        expect(boxAPI.renameFile).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.RENAME_FILE,
                fileData: {
                    diskName: d.diskName,
                    folderPath: d.folderPath,
                    oldName: d.oldName,
                    newName: d.newName,
                    boxUUID: d.boxUUID,
                },
            },
        ]);
    });

    it('rename file error (backend error)', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            folderPath: 'foo/bar',
            oldName: 'old.txt',
            newName: 'new.txt',
            boxUUID: 'some-uuid',
        };
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.renameFile = jest.fn().mockResolvedValue(new ErrorResponse('some-error'));

        await store.dispatch(renameFile(d));

        expect(boxAPI.renameFile).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_RENAME_FILE,
                error: 'some-error',
            },
        ]);
    });

    it('rename file error (unknown error)', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            folderPath: 'foo/bar',
            oldName: 'old.txt',
            newName: 'new.txt',
            boxUUID: 'some-uuid',
        };
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.renameFile = jest.fn().mockRejectedValue('some-error');

        await store.dispatch(renameFile(d));

        expect(boxAPI.renameFile).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_PERFORM_FS_ACTION,
                error: 'some-error',
            },
        ]);
    });

    it('delete file success', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            filePath: 'foo/bar',
            boxUUID: 'some-uuid',
        };
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.deleteFile = jest.fn().mockResolvedValue(new SuccessResponse());

        await store.dispatch(deleteFile(d));

        expect(boxAPI.deleteFile).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.DELETE_FILE,
                fileData: {
                    diskName: d.diskName,
                    filePath: d.filePath,
                    boxUUID: d.boxUUID,
                },
            },
        ]);
    });

    it('delete file error (backend error)', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            filePath: 'foo/bar',
            boxUUID: 'some-uuid',
        };
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.deleteFile = jest.fn().mockResolvedValue(new ErrorResponse('some-error'));

        await store.dispatch(deleteFile(d));

        expect(boxAPI.deleteFile).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_DELETE_FILE,
                error: 'some-error',
            },
        ]);
    });

    it('delete file error (unknown error)', async () => {
        const d = {
            tunnelDomain: 'www.google.com',
            diskName: 'disk_name',
            filePath: 'foo/bar',
            boxUUID: 'some-uuid',
        };
        const store = mockStore({ error: null });
        // noinspection JSValidateTypes
        boxAPI.deleteFile = jest.fn().mockRejectedValue('some-error');

        await store.dispatch(deleteFile(d));

        expect(boxAPI.deleteFile).toBeCalledWith(d);
        expect(store.getActions()).toEqual([
            {
                type: ACTIONS.FAILED_TO_PERFORM_FS_ACTION,
                error: 'some-error',
            },
        ]);
    });
});
