import { ACTIONS } from '../actionTypes';
import { boxesReducer } from '../reducer';

describe('box reducer tests', () => {
    it('reduce known action', () => {
        const boxes = ['b1', 'b2'];

        expect(boxesReducer(undefined, {
            type: ACTIONS.SET_BOXES,
            boxes,
        })).toEqual(boxes);
    });

    it('reduce unknown action (without state)', () => {
        expect(boxesReducer(undefined, {
            type: 'foo:bar',
            boxes: ['b1', 'b2'],
        })).toEqual([]);
    });

    it('reduce unknown action (with state)', () => {
        const boxes = ['b1', 'b2'];

        expect(boxesReducer(boxes, {
            type: 'foo:bar',
            boxes: ['b1'],
        })).toEqual(boxes);
    });
});
