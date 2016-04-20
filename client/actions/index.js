import api from '../../common/api';
import * as types from '../../common/ActionTypes';

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
    todoId: todo.todoId,
    completed: !todo.completed,
  });
}
