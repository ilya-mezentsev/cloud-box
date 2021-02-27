
export const ACTIONS = {
    CREATE_FOLDER: 'create:folder',
    SET_FOLDER: 'set:folder',
    DELETE_FOLDER: 'delete:folder',
    RENAME_FOLDER: 'rename:folder',

    CREATE_FILE: 'create:file',
    DELETE_FILE: 'delete:file',
    RENAME_FILE: 'rename:file',

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
