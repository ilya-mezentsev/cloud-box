import {
    GET,
    PATCH,
    POST,
    DELETE,
    errorResponseOr,
    errorResponseOrDefault,
    SuccessResponse,
} from '../shared';

class FolderResponse extends SuccessResponse {
    /**
     *
     * @return {{path: string, nodes: Array<{nodeType: string, name: string}>}}
     */
    data() {
        return super.data();
    }
}

/**
 *
 * @param {string} tunnelDomain
 * @param {string} folderPath
 * @param {string} diskName
 * @return {Promise<FolderResponse | ErrorResponse>}
 */
export async function getFolder({
    tunnelDomain,
    folderPath,
    diskName,
}) {
    const response = await GET({
        absolutePath: tunnelDomain,
        path: 'folder',
        params: {
            folder_path: folderPath,
            disk_name: diskName,
        },
    });

    // noinspection JSUnresolvedVariable
    errorResponseOr(
        response,
        data => new FolderResponse({
            path: data.path,
            nodes: data.nodes.map(n => ({
                nodeType: n.node_type,
                name: n.name,
            })),
        }),
    );
}

/**
 *
 * @param {string} tunnelDomain
 * @param {string} diskName
 * @param {string} rootPath
 * @param {string} folderName
 * @return {Promise<SuccessResponse | ErrorResponse>}
 */
export async function createFolder({
    tunnelDomain,
    diskName,
    rootPath,
    folderName,
}) {
    const response = await POST({
        absolutePath: tunnelDomain,
        path: 'folder',
        body: {
            disk_name: diskName,
            root_path: rootPath,
            folder_name: folderName,
        }
    });

    return errorResponseOrDefault(response);
}

/**
 *
 * @param {string} tunnelDomain
 * @param {string} diskName
 * @param {string} rootPath
 * @param {string} oldName
 * @param {string} newName
 * @return {Promise<SuccessResponse | ErrorResponse>}
 */
export async function renameFolder({
    tunnelDomain,
    diskName,
    rootPath,
    oldName,
    newName,
}) {
    const response = await PATCH({
        absolutePath: tunnelDomain,
        path: 'folder',
        body: {
            disk_name: diskName,
            folder_path: rootPath,
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
 * @param {string} folderPath
 * @return {Promise<SuccessResponse | ErrorResponse>}
 */
export async function deleteFolder({
    tunnelDomain,
    diskName,
    folderPath,
}) {
    const response = await DELETE({
        absolutePath: tunnelDomain,
        path: 'folder',
        params: {
            disk_name: diskName,
            folder_path: folderPath,
        },
    });

    return errorResponseOrDefault(response);
}
