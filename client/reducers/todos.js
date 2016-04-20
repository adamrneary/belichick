import Immutable from 'immutable';
import uuid from 'node-uuid';

import {
  SERVER_UPDATE,
  ADD_TODO, DELETE_TODO, EDIT_TODO, TOGGLE_TODO,
} from '../../constants/ActionTypes';

const actions = {};

actions[SERVER_UPDATE] = (state, action) =>
  Immutable.fromJS(action.dataSnapshot.val().todos || {});

actions[ADD_TODO] = (state, action) => {
  const todoId = uuid.v1();
  return state.set(todoId, new Immutable.Map({
    todoId, title: action.title, completed: false, pendingUpdate: true,
  }));
};

actions[EDIT_TODO] = (state, action) => state
  .setIn([action.todoId, 'pendingUpdate'], true)
  .setIn([action.todoId, 'title'], action.title);

actions[TOGGLE_TODO] = (state, action) => state
  .setIn([action.todoId, 'pendingUpdate'], true)
  .setIn([action.todoId, 'completed'], !!action.completed);

actions[DELETE_TODO] = (state, action) => state
  .setIn([action.todoId, 'pendingRemoval'], true);

export default function todos(state = Immutable.fromJS({ todos: {} }), action) {
  if (actions[action.type]) {
    return actions[action.type](state, action);
  }
  return state;
}
