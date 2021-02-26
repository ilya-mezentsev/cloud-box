import { SuccessResponse, GET, errorResponseOr } from '../shared';

class DisksResponse extends SuccessResponse {
    /**
     *
     * @return {{disks: Array<string>}}
     */
    data() {
        return super.data();
    }
}

/**
 *
 * @param {string} tunnelDomain
 * @return {Promise<DisksResponse | ErrorResponse>}
 */
export async function getDisks(tunnelDomain) {
    const response = await GET({
        absolutePath: tunnelDomain,
        path: 'disks',
    });

    return errorResponseOr(response, data => new DisksResponse(data));
}
