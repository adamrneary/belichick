import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import serverState from './serverState';

const rootReducer = combineReducers({
  serverState,
  routing: routerReducer,
});

export default rootReducer;
