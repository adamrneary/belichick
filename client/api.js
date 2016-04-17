import request from 'superagent';

import config from '.././config';

const onPostSuccess = () => {
  console.log('Yay!');
};
const onPostFailure = (err) => {
  console.error(err);
};
const postAction = (payload) => {
  request
    .post(config.apiEndpoint)
    .send({ type: payload.type, payload })
    .end((err, res) => {
      if (err || !res.ok) {
        onPostFailure(err);
      } else {
        onPostSuccess(res.body);
      }
    });
};

export default { postAction };
