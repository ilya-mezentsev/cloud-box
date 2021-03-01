/**
 *
 * @param {string} boxUUID
 * @return {Object}
 */
export function makeBoxRequestHeaders({
    boxUUID
}) {
    return {
        'X-Box-UUID': boxUUID,
        /**
         * localtunnel блочит запросы предупреждением о возможной фишинговой атаке
         * и просит выставить этот заголовок, если делается запрос из js-а
         */
        'Bypass-Tunnel-Reminder': 'localtunnel',
    };
}
