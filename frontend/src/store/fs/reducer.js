import { initialState } from '../state/initial';
import { ACTIONS } from './actionTypes';
import { buildPath, folderPathFromFilePath, filenameFromFilePath } from './helper';

/**
 *
 * @param {Object} state
 * @param {{type: string, disks: Array<string>}} action
 * @return {Object}
 */
export function fsReducer(state = initialState, action) {
    if (ACTIONS.folderActions.includes(action.type)) {
        return folderReducer(state, action);
    } else if (ACTIONS.fileActions.includes(action.type)) {
        return fileReducer(state, action);
    } else {
        return state;
    }
}

/**
 *
 * @param {Object} state
 * @param {{type: string, folderData: any}} action
 * @return {Object}
 */
function folderReducer(state = initialState, action) {
    switch (action.type) {
        case ACTIONS.SET_FOLDER:
            return onSetFolder(state, action.folderData);

        case ACTIONS.CREATE_FOLDER:
            return onCreateFolder(state, action.folderData);

        case ACTIONS.RENAME_FOLDER:
            return onRenameFolder(state, action.folderData);

        case ACTIONS.DELETE_FOLDER:
            return onDeleteFolder(state, action.folderData);

        default:
            return state;
    }
}

/**
 *
 * @param {Object} state
 * @param {{
 *  nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>,
 *  folderPath: string,
 *  diskName: string,
 *  boxUUID: string,
 * }} folderData
 * @return {Object}
 */
function onSetFolder(state = initialState, folderData) {
    return {
        ...state,
        fs: state.fs.concat({
            path: buildPath({
                boxUUID: folderData.boxUUID,
                diskName: folderData.diskName,
                components: [folderData.folderPath],
            }),
            nodes: folderData.nodes,
        }),
    };
}

/**
 *
 * @param {Object} state
 * @param {{diskName: string, rootPath: string, folderName: string, boxUUID: string}} folderData
 * @return {Object}
 */
function onCreateFolder(state = initialState, folderData) {
    return {
        ...state,
        fs: state.fs.concat({
            path: buildPath({
                boxUUID: folderData.boxUUID,
                diskName: folderData.diskName,
                components: [folderData.rootPath, folderData.folderName],
            }),
            nodes: [],
        }),
    };
}

/**
 *
 * @param {Object} state
 * @param {{diskName: string, rootPath: string, oldName: string, newName: string, boxUUID: string}} folderData
 * @return {Object}
 */
function onRenameFolder(state = initialState, folderData) {
    const renamedFolderPath = buildPath({
        boxUUID: folderData.boxUUID,
        diskName: folderData.diskName,
        components: [folderData.rootPath, folderData.oldName],
    });
    const folderIndex = state.fs.findIndex(folder => folder.path === renamedFolderPath);

    if (folderIndex >= 0) {
        const existsFolder = state.fs[folderIndex];
        state.fs.splice(folderIndex, 1, {
            path: buildPath({
                boxUUID: folderData.boxUUID,
                diskName: folderData.diskName,
                components: [folderData.rootPath, folderData.newName],
            }),
            nodes: existsFolder.nodes,
        });
    }

    return state;
}

/**
 *
 * @param {Object} state
 * @param {{diskName: string, folderPath: string, boxUUID: string}} folderData
 * @return {Object}
 */
function onDeleteFolder(state = initialState, folderData) {
    const deletedFolderPath = buildPath({
        boxUUID: folderData.boxUUID,
        diskName: folderData.diskName,
        components: [folderData.folderPath],
    });

    return {
        ...state,
        fs: state.fs.filter(folder => !folder.path.startsWith(deletedFolderPath)),
    };
}

/**
 *
 * @param {Object} state
 * @param {{type: string, fileData: any}} action
 * @return {Object}
 */
function fileReducer(state = initialState, action) {
    switch (action.type) {
        case ACTIONS.CREATE_FILE:
            return onCreateFile(state, action.fileData);

        case ACTIONS.RENAME_FILE:
            return onRenameFile(state, action.fileData);

        case ACTIONS.DELETE_FILE:
            return onDeleteFile(state, action.fileData);

        default:
            return state;
    }
}

/**
 *
 * @param {Object} state
 * @param {{diskName: string, folderPath: string, file: File, boxUUID: string}} fileData
 * @return {Object}
 */
function onCreateFile(state = initialState, fileData) {
    const newFileFolderPath = buildPath({
        boxUUID: fileData.boxUUID,
        diskName: fileData.diskName,
        components: [fileData.folderPath],
    });
    const newFileFolder = state.fs.find(folder => folder.path === newFileFolderPath);
    if (newFileFolder) {
        newFileFolder.nodes.push({
            nodeType: 'file',
            name: fileData.file.name,
        });
    }

    return state;
}

/**
 *
 * @param {Object} state
 * @param {{diskName: string, folderPath: string, oldName: string, newName: string, boxUUID: string}} fileData
 * @return {Object}
 */
function onRenameFile(state = initialState, fileData) {
    const renamedFileFolderPath = buildPath({
        boxUUID: fileData.boxUUID,
        diskName: fileData.diskName,
        components: [fileData.folderPath],
    });
    const renamedFileFolder = state.fs.find(folder => folder.path === renamedFileFolderPath);
    if (renamedFileFolder) {
        const existsFileIndex = renamedFileFolder.nodes.findIndex(n => n.name === fileData.oldName);
        if (existsFileIndex >= 0) {
            const existsFile = renamedFileFolder.nodes[existsFileIndex];
            renamedFileFolder.nodes.splice(existsFileIndex, 1, {
                nodeType: existsFile.type,
                name: fileData.newName,
            });
        }
    }

    return state;
}

/**
 *
 * @param {Object} state
 * @param {{diskName: string, filePath: string, boxUUID: string}} fileData
 * @return {Object}
 */
function onDeleteFile(state = initialState, fileData) {
    const deletedFileFolderPath = folderPathFromFilePath({
        boxUUID: fileData.boxUUID,
        diskName: fileData.diskName,
        filePath: fileData.filePath,
    });
    const deletedFileFolder = state.fs.find(folder => folder.path === deletedFileFolderPath);
    if (deletedFileFolder) {
        const deletedFilename = filenameFromFilePath(fileData.filePath)
        deletedFileFolder.nodes = deletedFileFolder.nodes.filter(node => node.name !== deletedFilename);
    }

    return state;
}
