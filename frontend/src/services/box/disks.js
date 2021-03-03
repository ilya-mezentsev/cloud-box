import { SuccessResponse, GET, errorResponseOr } from '../shared';
import { makeBoxRequestHeaders } from './shared';

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
 * @param {string} boxUUID
 * @return {Promise<DisksResponse | ErrorResponse>}
 */
export async function getDisks({tunnelDomain, boxUUID}) {
    const response = await GET({
        absolutePath: tunnelDomain,
        path: 'disks',
        headers: makeBoxRequestHeaders({
            boxUUID,
        }),
    });

    return errorResponseOr(response, data => new DisksResponse(data));
}
