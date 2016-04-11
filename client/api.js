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
  todos: {
    create: (title) => {
      sendPost({
        operation: 'create',
        payload: { title },
      });
    },
    update: (id, title) => {
      sendPost({
        operation: 'update',
        payload: { id, title },
      });
    },
    toggle: (todo) => {
      sendPost({
        operation: 'toggle',
        payload: { id: todo.id, completed: !todo.completed },
      });
    },
    delete: (id) => {
      sendPost({
        operation: 'delete',
        payload: { id },
      });
    },
  },
};
