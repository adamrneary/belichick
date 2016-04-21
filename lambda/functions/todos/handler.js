import Firebase from 'firebase';
import uuid from 'node-uuid';

import * as types from '../../../../common/ActionTypes';
import config from '../../../../config';

const increment = val => (val || 0) + 1;
const getFirebaseRef = () => new Firebase(config.firebaseUrl);
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
    const fb = getFirebaseRef();
    fb.child('experiments/colorScheme/targetAllocation').once('value', dataSnapshot => {
      const variant = Math.random() < dataSnapshot.val() ? 'light' : 'dark';
      fb.child(`users/${userId}`)
        .set({ userId, variant, todos: {} }, err => {
          if (err) {
            callback(err);
          } else {
            fb.child(`experiments/colorScheme/performanceData/${variant}/users`)
            .transaction(increment, callback);
          }
        });
    });
  }
};

actions[types.ADD_TODO] = (event, context, callback) => {
  const fields = ['userId', 'title'];
  if (validatePresence(fields, event.payload, types.ADD_TODO, callback)) {
    const { userId, title } = event.payload;
    const todoId = uuid.v1();
    const fb = getFirebaseRef();
    fb.child(`users/${userId}/todos/${todoId}`)
      .setWithPriority({ todoId, title, completed: false }, Date.now(), err => {
        if (err) {
          callback(err);
        } else {
          fb.child(`users/${userId}/variant`).once('value', dataSnapshot => {
            fb.child(`experiments/colorScheme/performanceData/${dataSnapshot.val()}/todosCreated`)
              .transaction(increment, callback);
          });
        }
      });
  }
};

actions[types.EDIT_TODO] = (event, context, callback) => {
  const fields = ['userId', 'todoId', 'title'];
  if (validatePresence(fields, event.payload, types.EDIT_TODO, callback)) {
    const { userId, todoId, title } = event.payload;
    getFirebaseRef().child(`users/${userId}/todos/${todoId}/title`)
      .set(title, callback);
  }
};

actions[types.TOGGLE_TODO] = (event, context, callback) => {
  const fields = ['userId', 'todoId', 'completed'];
  if (validatePresence(fields, event.payload, types.TOGGLE_TODO, callback)) {
    const { userId, todoId, completed } = event.payload;
    const fb = getFirebaseRef();
    fb.child(`users/${userId}/todos/${todoId}/completed`)
      .set(!!completed, err => {
        if (err) {
          callback(err);
        } else {
          if (!!completed) {
            fb.child(`users/${userId}/variant`).once('value', dS => {
              fb.child(`experiments/colorScheme/performanceData/${dS.val()}/todosCompleted`)
                .transaction(increment, callback);
            });
          } else {
            callback();
          }
        }
      });
  }
};

actions[types.DELETE_TODO] = (event, context, callback) => {
  const fields = ['userId', 'todoId'];
  if (validatePresence(fields, event.payload, types.DELETE_TODO, callback)) {
    const { userId, todoId } = event.payload;
    getFirebaseRef().child(`users/${userId}/todos/${todoId}`)
      .remove(callback);
  }
};

actions[types.UPDATE_ALLOCATION] = (event, context, callback) => {
  const fields = ['val'];
  if (validatePresence(fields, event.payload, types.UPDATE_ALLOCATION, callback)) {
    const { val } = event.payload;
    getFirebaseRef().child('experiments/colorScheme/targetAllocation')
      .set(val, callback);
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
  if (actions[type]) {
    actions[type](event, context, context.done);
  } else {
    context.done(new Error(`Unrecognized action type "${type}"`));
  }
};
