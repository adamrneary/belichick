import Firebase from 'firebase';
import uuid from 'node-uuid';

import config from './config';

const getFirebaseRef = () => new Firebase(`${config.firebaseUrl}todos/`);

export default {
  todos: {
    create: (title) => {
      console.log('create', title);
      const id = uuid.v1();
      getFirebaseRef().child(id).setWithPriority(
        { id, title, completed: false },
        Date.now()
      );
    },
    update: (id, title) => {
      console.log('update', id, title);
      getFirebaseRef().child(id).child('title').set(title);
    },
    toggle: (todo) => {
      console.log('toggle', todo);
      getFirebaseRef().child(todo.id).child('completed').set(!todo.completed);
    },
    delete: (id) => {
      console.log('delete', id);
      getFirebaseRef().child(id).remove();
    },
  },
};
