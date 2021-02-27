import { removeLeadingAndTrailingSlashes } from '../../services/shared';

/**
 *
 * @param {string} boxUUID
 * @param {string} diskName
 * @param {Array<string>} components
 * @return {string}
 */
export function buildPath({
    boxUUID,
    diskName,
    components
}) {
    return `${boxUUID}:/${diskName}/${components.map(removeLeadingAndTrailingSlashes).join('/')}`;
}

/**
 *
 * @param {string} boxUUID
 * @param {string} diskName
 * @param {string} filePath
 * @return {string}
 */
export function folderPathFromFilePath({
    boxUUID,
    diskName,
    filePath,
}) {
    let fileFolderPath = '';
    const lastSlashIndex = filePath.lastIndexOf('/');
    if (lastSlashIndex >= 0) {
        fileFolderPath = filePath.substring(0, lastSlashIndex);
    }

    return buildPath({
        boxUUID,
        diskName,
        components: [fileFolderPath],
    });
}

/**
 *
 * @param {string} filePath
 * @return {string}
 */
export function filenameFromFilePath(filePath) {
    const lastSlashIndex = filePath.lastIndexOf('/');
    if (lastSlashIndex >= 0) {
        return filePath.substr(lastSlashIndex+1);
    } else {
        return filePath;
    }
}
