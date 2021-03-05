import { ACTIONS } from '../actionTypes';
import { sessionReducer } from '../reducer';

describe('session reducer tests', () => {
    it('reduce set session action', () => {
        expect(sessionReducer(undefined, {
            type: ACTIONS.SET_SESSION,
            sessionHash: 'some-hash'
        })).toEqual('some-hash');
    });

    it('reduce unset session action', () => {
        expect(sessionReducer(undefined, {
            type: ACTIONS.UNSET_SESSION,
        })).toEqual('');
    });

    it('reduce unknown action (without state)', () => {
        expect(sessionReducer(undefined, {
            type: 'foo:bar',
            sessionHash: 'some-hash'
        })).toEqual('');
    });

    it('reduce unknown action (with state)', () => {
        expect(sessionReducer('account-hash', {
            type: 'foo:bar',
            sessionHash: 'some-hash'
        })).toEqual('account-hash');
    });
});
