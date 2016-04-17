import request from 'superagent';

import config from '.././config';

const onPostSuccess = () => {
  console.log('Yay!');
};
const onPostFailure = (err) => {
  console.error(err);
};
const sendPost = ({ operation, payload }) => {
  request
    .post(config.apiEndpoint)
    .send({ operation, payload })
    .end((err, res) => {
      if (err || !res.ok) {
        onPostFailure(err);
      } else {
        onPostSuccess(res.body);
      }
    });
};

export default {
  users: {
    create: (id) => {
      sendPost({
        operation: 'createUser',
        payload: { id },
      });
    },
  },
  todos: {
    create: (userId, title) => {
      sendPost({
        operation: 'createTodo',
        payload: { userId, title },
      });
    },
    update: (userId, id, title) => {
      sendPost({
        operation: 'updateTodo',
        payload: { userId, id, title },
      });
    },
    toggle: (userId, todo) => {
      sendPost({
        operation: 'toggleTodo',
        payload: { userId, id: todo.id, completed: !todo.completed },
      });
    },
    delete: (userId, id) => {
      sendPost({
        operation: 'deleteTodo',
        payload: { userId, id },
      });
    },
  },
};
