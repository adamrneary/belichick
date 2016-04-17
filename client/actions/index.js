import api from '../api';
import * as types from '../../constants/ActionTypes';

const postAndReturn = (actionObject) => {
  api.postAction(actionObject);
  return actionObject;
};

export function onFirebaseValue(dataSnapshot) {
  return { type: types.SERVER_UPDATE, dataSnapshot };
}

export function addUser(userId) {
  return postAndReturn({ type: types.ADD_USER, userId });
}

export function addTodo(userId, title) {
  return postAndReturn({ type: types.ADD_TODO, userId, title });
}

export function deleteTodo(userId, todoId) {
  return postAndReturn({ type: types.DELETE_TODO, userId, todoId });
}

export function editTodo(userId, todoId, title) {
  return postAndReturn({ type: types.EDIT_TODO, userId, todoId, title });
}

export function toggleTodo(userId, todo) {
  return postAndReturn({
    type: types.TOGGLE_TODO,
    userId,
    todoId: todo.id,
    completed: !todo.completed,
  });
}

export function completeAll(userId) {
  return { type: types.COMPLETE_ALL, userId };
}

export function clearCompleted(userId) {
  return { type: types.CLEAR_COMPLETED, userId };
}
