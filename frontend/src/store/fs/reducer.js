import { ACTIONS } from './actionTypes';
import { buildPath, folderPathFromFilePath, filenameFromFilePath } from './helper';

/**
 *
 * @param {Array<{path: string, nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>}>} state
 * @param {{type: string, disks: Array<string>}} action
 * @return {Object}
 */
export function fsReducer(state = [], action) {
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
 * @param {Array<{path: string, nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>}>} state
 * @param {{type: string, folderData: any}} action
 * @return {Array<{path: string, nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>}>}
 */
function folderReducer(state = [], action) {
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
 * @param {Array<{path: string, nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>}>} state
 * @param {{
 *  nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>,
 *  folderPath: string,
 *  diskName: string,
 *  boxUUID: string,
 * }} folderData
 * @return {Array<{path: string, nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>}>}
 */
function onSetFolder(state = [], folderData) {
    return state.concat({
        path: buildPath({
            boxUUID: folderData.boxUUID,
            diskName: folderData.diskName,
            components: [folderData.folderPath],
        }),
        nodes: folderData.nodes,
    });
}

/**
 *
 * @param {Array<{path: string, nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>}>} state
 * @param {{diskName: string, rootPath: string, folderName: string, boxUUID: string}} folderData
 * @return {Array<{path: string, nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>}>}
 */
function onCreateFolder(state = [], folderData) {
    return state.concat({
        path: buildPath({
            boxUUID: folderData.boxUUID,
            diskName: folderData.diskName,
            components: [folderData.rootPath, folderData.folderName],
        }),
        nodes: [],
    });
}

/**
 *
 * @param {Array<{path: string, nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>}>} state
 * @param {{diskName: string, rootPath: string, oldName: string, newName: string, boxUUID: string}} folderData
 * @return {Array<{path: string, nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>}>}
 */
function onRenameFolder(state = [], folderData) {
    const renamedFolderPath = buildPath({
        boxUUID: folderData.boxUUID,
        diskName: folderData.diskName,
        components: [folderData.rootPath, folderData.oldName],
    });
    const folderIndex = state.findIndex(folder => folder.path === renamedFolderPath);

    if (folderIndex >= 0) {
        const existsFolder = state[folderIndex];
        state.splice(folderIndex, 1, {
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
 * @param {Array<{path: string, nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>}>} state
 * @param {{diskName: string, folderPath: string, boxUUID: string}} folderData
 * @return {Array<{path: string, nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>}>}
 */
function onDeleteFolder(state = [], folderData) {
    const deletedFolderPath = buildPath({
        boxUUID: folderData.boxUUID,
        diskName: folderData.diskName,
        components: [folderData.folderPath],
    });

    return state.filter(folder => !folder.path.startsWith(deletedFolderPath));
}

/**
 *
 * @param {Array<{path: string, nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>}>} state
 * @param {{type: string, fileData: any}} action
 * @return {Array<{path: string, nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>}>}
 */
function fileReducer(state = [], action) {
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
 * @param {Array<{path: string, nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>}>} state
 * @param {{diskName: string, folderPath: string, file: File, boxUUID: string}} fileData
 * @return {Array<{path: string, nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>}>}
 */
function onCreateFile(state = [], fileData) {
    const newFileFolderPath = buildPath({
        boxUUID: fileData.boxUUID,
        diskName: fileData.diskName,
        components: [fileData.folderPath],
    });
    const newFileFolder = state.find(folder => folder.path === newFileFolderPath);
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
 * @param {Array<{path: string, nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>}>} state
 * @param {{diskName: string, folderPath: string, oldName: string, newName: string, boxUUID: string}} fileData
 * @return {Array<{path: string, nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>}>}
 */
function onRenameFile(state = [], fileData) {
    const renamedFileFolderPath = buildPath({
        boxUUID: fileData.boxUUID,
        diskName: fileData.diskName,
        components: [fileData.folderPath],
    });
    const renamedFileFolder = state.find(folder => folder.path === renamedFileFolderPath);
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
 * @param {Array<{path: string, nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>}>} state
 * @param {{diskName: string, filePath: string, boxUUID: string}} fileData
 * @return {Array<{path: string, nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>}>}
 */
function onDeleteFile(state = [], fileData) {
    const deletedFileFolderPath = folderPathFromFilePath({
        boxUUID: fileData.boxUUID,
        diskName: fileData.diskName,
        filePath: fileData.filePath,
    });
    const deletedFileFolder = state.find(folder => folder.path === deletedFileFolderPath);
    if (deletedFileFolder) {
        const deletedFilename = filenameFromFilePath(fileData.filePath)
        deletedFileFolder.nodes = deletedFileFolder.nodes.filter(node => node.name !== deletedFilename);
    }

    return state;
}
