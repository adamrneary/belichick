import { combineReducers } from 'redux';

import experiments from './experiments';

const rootReducer = combineReducers({
  experiments,
});

export default rootReducer;
