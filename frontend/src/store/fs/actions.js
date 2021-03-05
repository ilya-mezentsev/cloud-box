import {
    getFolder as getFolderAPI,
    createFolder as createFolderAPI,
    renameFolder as renameFolderAPI,
    deleteFolder as deleteFolderAPI,

    createFile as createFileAPI,
    renameFile as renameFileAPI,
    deleteFile as deleteFileAPI,
} from '../../services/box';
import { ACTIONS } from './actionTypes';

/**
 *
 * @param {string} tunnelDomain
 * @param {string} folderPath
 * @param {string} diskName
 * @param {string} boxUUID
 * @return {function(*): Promise<void>}
 */
export function getFolder({
    tunnelDomain,
    folderPath,
    diskName,
    boxUUID,
}) {
    return async dispatch => {
        try {
            const folderResponse = await getFolderAPI({
                tunnelDomain,
                folderPath,
                diskName,
                boxUUID,
            });

            if (folderResponse.isOk()) {
                dispatch({
                    type: ACTIONS.SET_FOLDER,
                    folderData: {
                        nodes: folderResponse.data().nodes,
                        folderPath,
                        diskName,
                        boxUUID,
                    },
                });
            } else {
                dispatch({
                    type: ACTIONS.FAILED_TO_FETCH_FOLDER,
                    error: folderResponse.data(),
                });
            }
        } catch (e) {
            dispatch({
                type: ACTIONS.FAILED_TO_PERFORM_FS_ACTION,
                error: e,
            });
        }
    };
}

/**
 *
 * @param {string} tunnelDomain
 * @param {string} diskName
 * @param {string} rootPath
 * @param {string} folderName
 * @param {string} boxUUID
 * @return {function(*): Promise<void>}
 */
export function createFolder({
    tunnelDomain,
    diskName,
    rootPath,
    folderName,
    boxUUID,
}) {
    return async dispatch => {
        try {
            const createFolderResponse = await createFolderAPI({
                tunnelDomain,
                diskName,
                rootPath,
                folderName,
                boxUUID,
            });

            if (createFolderResponse.isOk()) {
                dispatch({
                    type: ACTIONS.CREATE_FOLDER,
                    folderData: {
                        diskName,
                        rootPath,
                        folderName,
                        boxUUID,
                    },
                })
            } else {
                dispatch({
                    type: ACTIONS.FAILED_TO_CREATE_FOLDER,
                    error: createFolderResponse.data(),
                });
            }
        } catch (e) {
            dispatch({
                type: ACTIONS.FAILED_TO_PERFORM_FS_ACTION,
                error: e,
            });
        }
    };
}

/**
 *
 * @param {string} tunnelDomain
 * @param {string} diskName
 * @param {string} rootPath
 * @param {string} oldName
 * @param {string} newName
 * @param {string} boxUUID
 * @return {function(*): Promise<void>}
 */
export function renameFolder({
    tunnelDomain,
    diskName,
    rootPath,
    oldName,
    newName,
    boxUUID,
}) {
    return async dispatch => {
        try {
            const renameFolderResponse = await renameFolderAPI({
                tunnelDomain,
                diskName,
                rootPath,
                oldName,
                newName,
                boxUUID,
            });

            if (renameFolderResponse.isOk()) {
                dispatch({
                    type: ACTIONS.RENAME_FOLDER,
                    folderData: {
                        diskName,
                        rootPath,
                        oldName,
                        newName,
                        boxUUID,
                    },
                });
            } else {
                dispatch({
                    type: ACTIONS.FAILED_TO_RENAME_FOLDER,
                    error: renameFolderResponse.data(),
                });
            }
        } catch (e) {
            dispatch({
                type: ACTIONS.FAILED_TO_PERFORM_FS_ACTION,
                error: e,
            });
        }
    };
}

/**
 *
 * @param {string} tunnelDomain
 * @param {string} diskName
 * @param {string} folderPath
 * @param {string} boxUUID
 * @return {function(*): Promise<void>}
 */
export function deleteFolder({
    tunnelDomain,
    diskName,
    folderPath,
    boxUUID,
}) {
    return async dispatch => {
        try {
            const deleteFolderResponse = await deleteFolderAPI({
                tunnelDomain,
                diskName,
                folderPath,
                boxUUID,
            });

            if (deleteFolderResponse.isOk()) {
                dispatch({
                    type: ACTIONS.DELETE_FOLDER,
                    folderData: {
                        diskName,
                        folderPath,
                        boxUUID,
                    },
                });
            } else {
                dispatch({
                    type: ACTIONS.FAILED_TO_DELETE_FOLDER,
                    error: deleteFolderResponse.data(),
                });
            }
        } catch (e) {
            dispatch({
                type: ACTIONS.FAILED_TO_PERFORM_FS_ACTION,
                error: e,
            });
        }
    };
}

export function getFile() {
    // todo not sure what we need to do here
}

/**
 *
 * @param {string} tunnelDomain
 * @param {string} diskName
 * @param {string} folderPath
 * @param {File} file
 * @param {string} boxUUID
 * @return {function(*): Promise<void>}
 */
export function createFile({
    tunnelDomain,
    diskName,
    folderPath,
    file,
    boxUUID,
}) {
    return async dispatch => {
        try {
            const createFileResponse = await createFileAPI({
                tunnelDomain,
                diskName,
                folderPath,
                file,
                boxUUID,
            });

            if (createFileResponse.isOk()) {
                dispatch({
                    type: ACTIONS.CREATE_FILE,
                    fileData: {
                        diskName,
                        folderPath,
                        file,
                        boxUUID,
                    }
                });
            } else {
                dispatch({
                    type: ACTIONS.FAILED_TO_CREATE_FILE,
                    error: createFileResponse.data(),
                });
            }
        } catch (e) {
            dispatch({
                type: ACTIONS.FAILED_TO_PERFORM_FS_ACTION,
                error: e,
            });
        }
    };
}

/**
 *
 * @param {string} tunnelDomain
 * @param {string} diskName
 * @param {string} folderPath
 * @param {string} oldName
 * @param {string} newName
 * @param {string} boxUUID
 * @return {function(*): Promise<void>}
 */
export function renameFile({
    tunnelDomain,
    diskName,
    folderPath,
    oldName,
    newName,
    boxUUID,
}) {
    return async dispatch => {
        try {
            const renameFileResponse = await renameFileAPI({
                tunnelDomain,
                diskName,
                folderPath,
                oldName,
                newName,
                boxUUID,
            });

            if (renameFileResponse.isOk()) {
                dispatch({
                    type: ACTIONS.RENAME_FILE,
                    fileData: {
                        diskName,
                        folderPath,
                        oldName,
                        newName,
                        boxUUID,
                    }
                });
            } else {
                dispatch({
                    type: ACTIONS.FAILED_TO_RENAME_FILE,
                    error: renameFileResponse.data(),
                });
            }
        } catch (e) {
            dispatch({
                type: ACTIONS.FAILED_TO_PERFORM_FS_ACTION,
                error: e,
            });
        }
    };
}

/**
 *
 * @param {string} tunnelDomain
 * @param {string} diskName
 * @param {string} filePath
 * @param {string} boxUUID
 * @return {function(*): Promise<void>}
 */
export function deleteFile({
    tunnelDomain,
    diskName,
    filePath,
    boxUUID,
}) {
    return async dispatch => {
        try {
            const deleteFileResponse = await deleteFileAPI({
                tunnelDomain,
                diskName,
                filePath,
                boxUUID,
            });

            if (deleteFileResponse.isOk()) {
                dispatch({
                    type: ACTIONS.DELETE_FILE,
                    fileData: {
                        diskName,
                        filePath,
                        boxUUID,
                    },
                })
            } else {
                dispatch({
                    type: ACTIONS.FAILED_TO_DELETE_FILE,
                    error: deleteFileResponse.data(),
                });
            }
        } catch (e) {
            dispatch({
                type: ACTIONS.FAILED_TO_PERFORM_FS_ACTION,
                error: e,
            });
        }
    }
}
