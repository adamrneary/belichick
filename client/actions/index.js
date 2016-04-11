import api from '../api';
import * as types from '../constants/ActionTypes';

export function onFirebaseValue(dataSnapshot) {
  return { type: types.SERVER_UPDATE, dataSnapshot };
}

export function addTodo(text) {
  api.todos.create(text);
  return { type: types.ADD_TODO, text };
}

export function deleteTodo(id) {
  api.todos.delete(id);
  return { type: types.DELETE_TODO, id };
}

export function editTodo(id, text) {
  return { type: types.EDIT_TODO, id, text };
}

export function toggleTodo(id) {
  return { type: types.TOGGLE_TODO, id };
}

export function completeAll() {
  return { type: types.COMPLETE_ALL };
}

export function clearCompleted() {
  return { type: types.CLEAR_COMPLETED };
}
