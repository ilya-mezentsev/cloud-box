import { ACTIONS as ERROR_ACTIONS } from '../error/actionTypes';

export const ACTIONS = {
    SET_SESSION: 'set:session',
    UNSET_SESSION: 'unset:session',

    FAILED_TO_CREATE_SESSION: ERROR_ACTIONS.SET_ERROR,
    FAILED_TO_DELETE_SESSION: ERROR_ACTIONS.SET_ERROR,
    FAILED_TO_GET_SESSION: ERROR_ACTIONS.SET_ERROR,
    FAILED_TO_PERFORM_SESSION_ACTION: ERROR_ACTIONS.SET_UNKNOWN_ERROR,
};
