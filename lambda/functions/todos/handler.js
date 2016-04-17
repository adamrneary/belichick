import Firebase from 'firebase';
import uuid from 'node-uuid';

import config from '../../../../config';

const getExperimentVal = (experiment, callback) => {
  const firebaseRef = new Firebase(config.firebaseUrl);
  firebaseRef.child('experiments').once('value', dataSnapshot => {
    const experimentVal = dataSnapshot.val()[experiment];
    console.log({ experimentVal });
    callback(null, experimentVal);
  });
};
const getFirebaseUserRef = (userId) => {
  const firebaseRef = new Firebase(config.firebaseUrl);
  return firebaseRef.child('users').child(userId);
};
const getFirebaseTodoRef = (userId, todoId) =>
  getFirebaseUserRef(userId).child('todos').child(todoId);

const actions = {

  createUser: (event, context, callback) => {
    const { id } = event.payload;
    if (id === undefined || id === null) {
      return callback(new Error('No id provided to create user action.'));
    }
    return getExperimentVal('colorScheme', (err, colorSchemeVal) => {
      console.log({ colorSchemeVal });
      const variant = Math.random() < colorSchemeVal ? 'light' : 'dark';
      return getFirebaseUserRef(id).set({ id, variant, todos: {} }, callback);
    });
  },

  createTodo: (event, context, callback) => {
    const { userId, title } = event.payload;
    if (userId === undefined || userId === null) {
      return callback(new Error('No userId provided to create todo action.'));
    }
    if (title === undefined || title === null) {
      return callback(new Error('No title provided to create todo action.'));
    }
    const id = uuid.v1();
    return getFirebaseTodoRef(userId, id)
      .setWithPriority(
        { id, title, completed: false },
        Date.now(),
        callback
      );
  },

  updateTodo: (event, context, callback) => {
    const { userId, id, title } = event.payload;
    if (userId === undefined || userId === null) {
      return callback(new Error('No userId provided to update todo action.'));
    }
    if (id === undefined || id === null) {
      return callback(new Error('No id provided to update todo action.'));
    }
    if (title === undefined || title === null) {
      return callback(new Error('No title provided to update todo action.'));
    }
    return getFirebaseTodoRef(userId, id)
      .child('title').set(title, callback);
  },

  toggleTodo: (event, context, callback) => {
    const { userId, id, completed } = event.payload;
    if (userId === undefined || userId === null) {
      return callback(new Error('No userId provided to toggle todo action.'));
    }
    if (id === undefined || id === null) {
      return callback(new Error('No id provided to toggle todo action.'));
    }
    return getFirebaseTodoRef(userId, id)
      .child('completed').set(!!completed, callback);
  },

  deleteTodo: (event, context, callback) => {
    const { userId, id } = event.payload;
    if (userId === undefined || userId === null) {
      return callback(new Error('No userId provided to delete todo action.'));
    }
    if (id === undefined || id === null) {
      return callback(new Error('No id provided to delete todo action.'));
    }
    return getFirebaseTodoRef(userId, id)
      .remove(callback);
  },

  echo: (event, context, callback) => {
    callback(null, event.payload);
  },

  ping: (event, context, callback) => {
    callback(null, 'pong');
  },
};


/**
 * Provide an event that contains the following keys:
 *
 *   - operation: one of the operations in the switch statement below
 *   - payload: a parameter to pass to the operation being performed
 */
module.exports.handler = (event, context) => {
  const { operation } = event;
  if (actions[operation]) {
    actions[operation](event, context, context.done);
  } else {
    context.done(new Error(`Unrecognized operation "${operation}"`));
  }
};
