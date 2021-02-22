import mime from 'mime-types';
import {POST, PATCH, DELETE, errorResponseOrDefault} from "../shared";

/**
 *
 * @param {string} tunnelDomain
 * @param {string} diskName
 * @param {string} filePath
 * @return {string}
 */
export function getFile({tunnelDomain, diskName, filePath}) {
    return `${tunnelDomain}/file?file_path=${filePath}&disk_name=${diskName}`;
}

/**
 *
 * @param {string} tunnelDomain
 * @param {string} diskName
 * @param {string} folderPath
 * @param {File} file
 * @return {Promise<SuccessResponse | ErrorResponse>}
 */
export async function createFile({
    tunnelDomain,
    diskName,
    folderPath,
    file,
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
 * @return {Promise<SuccessResponse | ErrorResponse>}
 */
export async function renameFile({
    tunnelDomain,
    diskName,
    folderPath,
    oldName,
    newName,
}) {
    const response = await PATCH({
        absolutePath: tunnelDomain,
        path: 'file',
        body: {
            disk_name: diskName,
            folder_path: folderPath,
            old_name: oldName,
            new_name: newName,
        }
    });

    return errorResponseOrDefault(response);
}

/**
 *
 * @param {string} tunnelDomain
 * @param {string} diskName
 * @param {string} filePath
 * @return {Promise<SuccessResponse | ErrorResponse>}
 */
export async function deleteFile({
    tunnelDomain,
    diskName,
    filePath,
}) {
    const response = await DELETE({
        absolutePath: tunnelDomain,
        path: 'file',
        params: {
            disk_name: diskName,
            file_path: filePath,
        },
    });

    return errorResponseOrDefault(response);
}
