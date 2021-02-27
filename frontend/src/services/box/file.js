import mime from 'mime-types';
import { POST, PATCH, DELETE, errorResponseOrDefault } from '../shared';
import { makeBoxRequestHeaders } from './shared';

/**
 *
 * @param {string} tunnelDomain
 * @param {string} diskName
 * @param {string} filePath
 * @param {string} boxUUID
 * @return {string}
 */
export function getFile({tunnelDomain, diskName, filePath, boxUUID}) {
    // todo how to pass boxUUID here?
    return `${tunnelDomain}/file?file_path=${filePath}&disk_name=${diskName}`;
}

/**
 *
 * @param {string} tunnelDomain
 * @param {string} diskName
 * @param {string} folderPath
 * @param {File} file
 * @param {string} boxUUID
 * @return {Promise<SuccessResponse | ErrorResponse>}
 */
export async function createFile({
    tunnelDomain,
    diskName,
    folderPath,
    file,
    boxUUID,
}) {
    const fd = new FormData();
    fd.append('disk_name', diskName);
    fd.append('folder_path', folderPath);
    fd.append('file', file);

    const response = await POST({
        absolutePath: tunnelDomain,
        path: 'file',
        body: fd,
        contentType: mime.lookup(file.name) || 'application/octet-stream',
        headers: makeBoxRequestHeaders({
            boxUUID,
        }),
    });

    return errorResponseOrDefault(response);
}

/**
 *
 * @param {string} tunnelDomain
 * @param {string} diskName
 * @param {string} folderPath
 * @param {string} oldName
 * @param {string} newName
 * @param {string} boxUUID
 * @return {Promise<SuccessResponse | ErrorResponse>}
 */
export async function renameFile({
    tunnelDomain,
    diskName,
    folderPath,
    oldName,
    newName,
    boxUUID,
}) {
    const response = await PATCH({
        absolutePath: tunnelDomain,
        path: 'file',
        body: {
            disk_name: diskName,
            folder_path: folderPath,
            old_name: oldName,
            new_name: newName,
        },
        headers: makeBoxRequestHeaders({
            boxUUID,
        }),
    });

    return errorResponseOrDefault(response);
}

/**
 *
 * @param {string} tunnelDomain
 * @param {string} diskName
 * @param {string} filePath
 * @param {string} boxUUID
 * @return {Promise<SuccessResponse | ErrorResponse>}
 */
export async function deleteFile({
    tunnelDomain,
    diskName,
    filePath,
    boxUUID,
}) {
    const response = await DELETE({
        absolutePath: tunnelDomain,
        path: 'file',
        params: {
            disk_name: diskName,
            file_path: filePath,
        },
        headers: makeBoxRequestHeaders({
            boxUUID,
        }),
    });

    return errorResponseOrDefault(response);
}
