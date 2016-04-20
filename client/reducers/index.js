import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import todos from './todos';
import variant from './variant';

const rootReducer = combineReducers({
  todos,
  variant,
  routing: routerReducer,
});

export default rootReducer;
