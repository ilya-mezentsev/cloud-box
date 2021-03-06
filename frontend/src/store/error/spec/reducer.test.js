import { ACTIONS } from '../actionTypes';
import { errorReducer } from '../reducer';

describe('error reducer tests', () => {
    it('reduce set error action', () => {
        const error = {code: 'code', description: 'description'};

        expect(errorReducer(undefined, {
            type: ACTIONS.SET_ERROR,
            error,
        })).toEqual(error);
    });

    it('reduce set unknown error action', () => {
        const error = {code: 'code', description: 'description'};

        expect(errorReducer(undefined, {
            type: ACTIONS.SET_UNKNOWN_ERROR,
            error,
        })).toEqual({
            code: 'unknown-error',
            description: 'Unknown error occurred',
        });
    });

    it('reduce unset error', () => {
        expect(errorReducer(undefined, {
            type: ACTIONS.UNSET_ERROR
        })).toBeNull();
    });

    it('reduce unknown action (without state)', () => {
        expect(errorReducer(undefined, {
            type: 'foo:bar',
            error: {code: 'code', description: 'description'},
        })).toBeNull();
    });

    it('reduce unknown action (with state)', () => {
        const error = {code: 'error-code', description: 'error-description'};

        expect(errorReducer(error, {
            type: 'foo:bar',
            error: {code: 'code', description: 'description'},
        })).toEqual(error);
    });
});
