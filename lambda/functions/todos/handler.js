import Firebase from 'firebase';
import uuid from 'node-uuid';

import config from '../../../config';

const getFirebaseRef = () => new Firebase(`${config.firebaseUrl}todos/`);

const actions = {

  create: (event, context, callback) => {
    const { title } = event.payload;
    if (title === undefined || title === null) {
      return callback(new Error('No title provided to create action.'));
    }
    const id = uuid.v1();
    return getFirebaseRef().child(id).setWithPriority(
      { id, title, completed: false },
      Date.now(),
      callback
    );
  },

  update: (event, context, callback) => {
    const { id, title } = event.payload;
    if (id === undefined || id === null) {
      return callback(new Error('No id provided to update action.'));
    }
    if (title === undefined || title === null) {
      return callback(new Error('No title provided to update action.'));
    }
    return getFirebaseRef().child(id).child('title').set(title, callback);
  },

  toggle: (event, context, callback) => {
    const { id, completed } = event.payload;
    if (id === undefined || id === null) {
      return callback(new Error('No id provided to toggle action.'));
    }
    return getFirebaseRef().child(id).child('completed').set(!!completed, callback);
  },

  delete: (event, context, callback) => {
    const { id } = event.payload;
    if (id === undefined || id === null) {
      return callback(new Error('No id provided to delete action.'));
    }
    return getFirebaseRef().child(id).remove(callback);
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
