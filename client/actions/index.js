import api from '../api';
import * as types from '../../constants/ActionTypes';

export function onFirebaseValue(dataSnapshot) {
  return { type: types.SERVER_UPDATE, dataSnapshot };
}

export function addTodo(userId, text) {
  api.todos.create(userId, text);
  return { type: types.ADD_TODO, userId, text };
}

export function deleteTodo(userId, id) {
  api.todos.delete(userId, id);
  return { type: types.DELETE_TODO, userId, id };
}

export function editTodo(userId, id, text) {
  return { type: types.EDIT_TODO, userId, id, text };
}

export function toggleTodo(userId, id) {
  return { type: types.TOGGLE_TODO, userId, id };
}

export function completeAll(userId) {
  return { type: types.COMPLETE_ALL, userId };
}

export function clearCompleted(userId) {
  return { type: types.CLEAR_COMPLETED, userId };
}
