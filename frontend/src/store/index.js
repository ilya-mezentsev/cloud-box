import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { sessionReducer } from './session/reducer';

export const store = createStore(sessionReducer, applyMiddleware(thunk));
