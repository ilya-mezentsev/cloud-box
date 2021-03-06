import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import { sessionReducer } from './session/reducer';
import { boxesReducer } from './boxes/reducer';
import { disksReducer } from './disks/reducer';
import { fsReducer } from './fs/reducer';
import { errorReducer } from './error/reducer';

const reducer = combineReducers({
    hash: sessionReducer,
    boxes: boxesReducer,
    disks: disksReducer,
    fs: fsReducer,
    error: errorReducer,
});

export const store = createStore(reducer, applyMiddleware(thunk));
