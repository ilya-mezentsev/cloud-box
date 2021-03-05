import { clearError } from '../actions';
import { ACTIONS } from '../actionTypes';

describe('error actions tests', () => {
    it('clear error', () => {
        expect(clearError()).toEqual({
            type: ACTIONS.UNSET_ERROR,
        });
    });
});
