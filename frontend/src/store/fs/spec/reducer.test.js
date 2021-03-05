import { ACTIONS } from '../actionTypes';
import { fsReducer, folderReducer, fileReducer } from '../reducer';

describe('fs reducer tests', () => {
    it('reduce set folder action', () => {
        const nodes = ['n1', 'n2'];

        expect(fsReducer(undefined, {
            type: ACTIONS.SET_FOLDER,
            folderData: {
                folderPath: 'foo/bar',
                diskName: 'disk_name',
                boxUUID: 'some-uuid',
                nodes
            },
        })).toEqual([
            {
                path: 'some-uuid:/disk_name/foo/bar',
                nodes,
            },
        ]);
    });

    it('reduce create folder action', () => {
        expect(fsReducer(undefined, {
            type: ACTIONS.CREATE_FOLDER,
            folderData: {
                diskName: 'disk_name',
                rootPath: 'foo',
                folderName: 'bar',
                boxUUID: 'some-uuid',
            },
        })).toEqual([
            {
                path: 'some-uuid:/disk_name/foo/bar',
                nodes: [],
            },
        ]);
    });

    it('reduce rename folder action (exists one)', () => {
        const nodes = ['n1', 'n2'];
        const initialState = [
            {
                path: 'some-uuid:/disk_name/foo/bar',
                nodes,
            },
        ];

        expect(fsReducer(initialState, {
            type: ACTIONS.RENAME_FOLDER,
            folderData: {
                diskName: 'disk_name',
                rootPath: 'foo',
                oldName: 'bar',
                newName: 'baz',
                boxUUID: 'some-uuid',
            },
        })).toEqual([
            {
                path: 'some-uuid:/disk_name/foo/baz',
                nodes,
            }
        ]);
    });

    it('reduce rename folder action (not exists one)', () => {
        expect(fsReducer(undefined, {
            type: ACTIONS.RENAME_FOLDER,
            folderData: {
                diskName: 'disk_name',
                rootPath: 'foo',
                oldName: 'old',
                newName: 'new',
                boxUUID: 'some-uuid',
            },
        })).toEqual([]);
    });

    it('reduce delete folder action (exists one)', () => {
        const nodes = ['n1', 'n2'];
        const initialState = [
            {
                path: 'some-uuid:/disk_name/foo/bar',
                nodes,
            },
            {
                path: 'some-uuid:/disk_name/foo/baz',
                nodes: [],
            },
        ];

        expect(fsReducer(initialState, {
            type: ACTIONS.DELETE_FOLDER,
            folderData: {
                diskName: 'disk_name',
                folderPath: 'foo/bar',
                boxUUID: 'some-uuid',
            },
        })).toEqual([
            {
                path: 'some-uuid:/disk_name/foo/baz',
                nodes: [],
            },
        ]);
    });

    it('reduce delete folder action (not exists one)', () => {
        expect(fsReducer(undefined, {
            type: ACTIONS.DELETE_FOLDER,
            folderData: {
                diskName: 'disk_name',
                folderPath: 'foo/bar',
                boxUUID: 'some-uuid',
            },
        })).toEqual([]);
    });

    it('reduce create file action (in exists folder)', () => {
        const initialState = [
            {
                path: 'some-uuid:/disk_name/foo/bar',
                nodes: [],
            },
        ];

        expect(fsReducer(initialState, {
            type: ACTIONS.CREATE_FILE,
            fileData: {
                diskName: 'disk_name',
                folderPath: 'foo/bar',
                file: new File([], 'baz.txt'),
                boxUUID: 'some-uuid',
            },
        })).toEqual([
            {
                path: 'some-uuid:/disk_name/foo/bar',
                nodes: [
                    {
                        nodeType: 'file',
                        name: 'baz.txt',
                    },
                ],
            },
        ]);
    });

    it('reduce create file action (in not exists folder)', () => {
        expect(fsReducer(undefined, {
            type: ACTIONS.CREATE_FILE,
            fileData: {
                diskName: 'disk_name',
                folderPath: 'foo/bar',
                file: new File([], 'baz.txt'),
                boxUUID: 'some-uuid',
            },
        })).toEqual([]);
    });

    it('reduce rename file action (exists one)', () => {
        const initialState = [
            {
                path: 'some-uuid:/disk_name/foo/bar',
                nodes: [
                    {
                        nodeType: 'file',
                        name: 'old.txt'
                    }
                ],
            },
        ];

        expect(fsReducer(initialState, {
            type: ACTIONS.RENAME_FILE,
            fileData: {
                diskName: 'disk_name',
                folderPath: 'foo/bar',
                oldName: 'old.txt',
                newName: 'new.txt',
                boxUUID: 'some-uuid',
            },
        })).toEqual([
            {
                path: 'some-uuid:/disk_name/foo/bar',
                nodes: [
                    {
                        nodeType: 'file',
                        name: 'new.txt'
                    }
                ],
            },
        ]);
    });

    it('reduce rename file action (not exists one)', () => {
        expect(fsReducer(undefined, {
            type: ACTIONS.RENAME_FILE,
            fileData: {
                diskName: 'disk_name',
                folderPath: 'foo/bar',
                oldName: 'old.txt',
                newName: 'new.txt',
                boxUUID: 'some-uuid',
            },
        })).toEqual([]);
    });

    it('reduce delete file action (exists one)', () => {
        const initialState = [
            {
                path: 'some-uuid:/disk_name/foo/bar',
                nodes: [
                    {
                        nodeType: 'file',
                        name: 'baz.txt'
                    }
                ],
            },
        ];

        expect(fsReducer(initialState, {
            type: ACTIONS.DELETE_FILE,
            fileData: {
                diskName: 'disk_name',
                filePath: 'foo/bar/baz.txt',
                boxUUID: 'some-uuid',
            },
        })).toEqual([
            {
                path: 'some-uuid:/disk_name/foo/bar',
                nodes: [],
            },
        ]);
    });

    it('reduce delete file action (not exists one)', () => {
        expect(fsReducer(undefined, {
            type: ACTIONS.DELETE_FILE,
            fileData: {
                diskName: 'disk_name',
                filePath: 'foo/bar/baz.txt',
                boxUUID: 'some-uuid',
            },
        })).toEqual([]);
    });

    it('reduce unknown action', () => {
        expect(fsReducer(undefined, {
            type: 'foo:bar',
            folderData: {},
        })).toEqual([]);
    });

    it('reduce unknown action by folderReducer', () => {
        expect(folderReducer(undefined, {
            type: 'foo:bar',
            folderData: {},
        })).toEqual([]);
    });

    it('reduce unknown action by fileReducer', () => {
        expect(fileReducer(undefined, {
            type: 'foo:bar',
            fileData: {},
        })).toEqual([]);
    });
});
