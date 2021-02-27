/**
 *
 * @type {{
 *  boxes: Array<{tunnelDomain: string, uuid: string, alias: string}>,
 *  disks: Array<string>,
 *  fs: Array<{path: string, nodes: Array<{nodeType: 'folder' | 'file' | 'unknown', name: string}>}>,
 *  hash: string
 * }}
 */
export const initialState = {
    hash: '',
    boxes: [],
    disks: [],
    fs: [],
};
