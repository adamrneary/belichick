import Firebase from 'firebase';
import uuid from 'node-uuid';

import * as types from '../../../../constants/ActionTypes';
import config from '../../../../config';

const getExperimentVal = (experiment, callback) => {
  const firebaseRef = new Firebase(config.firebaseUrl);
  firebaseRef.child('experiments').once('value', dataSnapshot => {
    callback(null, dataSnapshot.val()[experiment]);
  });
};
const getFirebaseUserRef = (userId) => {
  const firebaseRef = new Firebase(config.firebaseUrl);
  return firebaseRef.child('users').child(userId);
};
const getFirebaseTodoRef = (userId, todoId) =>
  getFirebaseUserRef(userId).child('todos').child(todoId);

const actions = {
  ping: (event, context, callback) => {
    callback(null, 'pong');
  },
  echo: (event, context, callback) => {
    callback(null, event.payload);
  },
};

const validatePresence = (fields, payload, action, callback) =>
  fields.reduce((memo, field) => {
    if (payload[field] === undefined || payload[field] === null) {
      callback(new Error(`No ${field} field provided to ${action} action.`));
      return false;
    }
    return memo;
  }, true);


actions[types.ADD_USER] = (event, context, callback) => {
  const fields = ['userId'];
  if (validatePresence(fields, event.payload, types.ADD_USER, callback)) {
    const { userId } = event.payload;
    getExperimentVal('colorScheme', (err, colorSchemeVal) => {
      const variant = Math.random() < colorSchemeVal ? 'light' : 'dark';
      getFirebaseUserRef(userId).set({ userId, variant, todos: {} }, callback);
    });
  }
};

actions[types.ADD_TODO] = (event, context, callback) => {
  const fields = ['userId', 'title'];
  if (validatePresence(fields, event.payload, types.ADD_TODO, callback)) {
    const { userId, title } = event.payload;
    const todoId = uuid.v1();
    getFirebaseTodoRef(userId, todoId).setWithPriority(
      { todoId, title, completed: false },
      Date.now(),
      callback
    );
  }
};

actions[types.EDIT_TODO] = (event, context, callback) => {
  const fields = ['userId', 'todoId', 'title'];
  if (validatePresence(fields, event.payload, types.EDIT_TODO, callback)) {
    const { userId, todoId, title } = event.payload;
    getFirebaseTodoRef(userId, todoId).child('title').set(title, callback);
  }
};

actions[types.TOGGLE_TODO] = (event, context, callback) => {
  const fields = ['userId', 'todoId', 'completed'];
  if (validatePresence(fields, event.payload, types.TOGGLE_TODO, callback)) {
    const { userId, todoId, completed } = event.payload;
    getFirebaseTodoRef(userId, todoId).child('completed').set(!!completed, callback);
  }
};

actions[types.DELETE_TODO] = (event, context, callback) => {
  const fields = ['userId', 'todoId'];
  if (validatePresence(fields, event.payload, types.DELETE_TODO, callback)) {
    const { userId, todoId } = event.payload;
    getFirebaseTodoRef(userId, todoId).child('completed').remove(callback);
  }
};

/**
 * Provide an event that contains the following keys:
 *
 *   - type: one of the operations in the actions object above
 *   - payload: a parameter to pass to the action being performed
 */
module.exports.handler = (event, context) => {
  const { type } = event;
  console.log({ event });
  if (actions[type]) {
    actions[type](event, context, context.done);
  } else {
    context.done(new Error(`Unrecognized action type "${type}"`));
  }
};
