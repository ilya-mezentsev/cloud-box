import { ACTIONS as ERROR_ACTIONS } from '../error/actionTypes';

export const ACTIONS = {
    CREATE_FOLDER: 'create:folder',
    FAILED_TO_CREATE_FOLDER: ERROR_ACTIONS.SET_ERROR,

    SET_FOLDER: 'set:folder',
    FAILED_TO_FETCH_FOLDER: ERROR_ACTIONS.SET_ERROR,

    DELETE_FOLDER: 'delete:folder',
    FAILED_TO_DELETE_FOLDER: ERROR_ACTIONS.SET_ERROR,

    RENAME_FOLDER: 'rename:folder',
    FAILED_TO_RENAME_FOLDER: ERROR_ACTIONS.SET_ERROR,

    CREATE_FILE: 'create:file',
    FAILED_TO_CREATE_FILE: ERROR_ACTIONS.SET_ERROR,

    DELETE_FILE: 'delete:file',
    FAILED_TO_DELETE_FILE: ERROR_ACTIONS.SET_ERROR,

    RENAME_FILE: 'rename:file',
    FAILED_TO_RENAME_FILE: ERROR_ACTIONS.SET_ERROR,

    FAILED_TO_PERFORM_FS_ACTION: ERROR_ACTIONS.SET_UNKNOWN_ERROR,

    get folderActions() {
        return [
            this.CREATE_FOLDER,
            this.SET_FOLDER,
            this.DELETE_FOLDER,
            this.RENAME_FOLDER,
        ];
    },

    get fileActions() {
        return [
            this.CREATE_FILE,
            this.DELETE_FILE,
            this.RENAME_FILE,
        ];
    },
};
