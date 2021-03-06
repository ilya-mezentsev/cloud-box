import { ACTIONS } from '../actionTypes';
import { disksReducer } from '../reducer';

describe('disks reducer tests', () => {
    it('reduce known action', () => {
        const disks = ['d1', 'd2'];

        expect(disksReducer(undefined, {
            type: ACTIONS.SET_DISKS,
            disks,
        })).toEqual(disks);
    });

    it('reduce unknown action (without state)', () => {
        const disks = ['d1', 'd2'];

        expect(disksReducer(undefined, {
            type: 'foo:bar',
            disks,
        })).toEqual([]);
    });

    it('reduce unknown action (with state)', () => {
        const disks = ['d1', 'd2'];

        expect(disksReducer(disks, {
            type: 'foo:bar',
            disks: ['d3'],
        })).toEqual(disks);
    });
});
