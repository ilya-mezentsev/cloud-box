import {
    GET,
    POST,
    SuccessResponse,
    errorResponseOr,
    errorResponseOrDefault,
} from '../shared';

class AccountBoxesResponse extends SuccessResponse {
    /**
     *
     * @return {Array<{tunnelDomain: string, uuid: string}>}
     */
    data() {
        return super.data();
    }
}

/**
 *
 * @param {string} accountHash
 * @return Promise<AccountBoxesResponse | ErrorResponse>
 */
export async function fetchBoxes(accountHash) {
    const response = await GET({
        path: `boxes/${accountHash}`
    });

    return errorResponseOr(
        response,
            data => new AccountBoxesResponse(data.map(box => ({
                tunnelDomain: box.tunnel_domain,
                uuid: box.uuid,
            }))),
        )
}

/**
 *
 * @param {string} accountHash
 * @param {string} boxUUID
 * @return {Promise<SuccessResponse | ErrorResponse>}
 */
export async function bindBox({accountHash, boxUUID}) {
    const response = await POST({
        path: 'box',
        body: {
            account_hash: accountHash,
            box_uuid: boxUUID,
        }
    });

    return errorResponseOrDefault(response);
}