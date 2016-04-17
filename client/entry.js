import uuid from 'node-uuid';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import addUser from './actions';
import App from './containers/App';
import Loading from './components/Loading';
import configureStore from './store/configureStore';
import './static/base.css';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

window.React = React;

if (module.hot) {
  module.hot.accept();
}

const requireUser = (nextState, replace) => {
  const newUserId = uuid.v1();
  addUser(newUserId);
  replace(`/users/${newUserId}`);
};

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/users/:userId" component={App} />
      <Route path="*" component={Loading} onEnter={requireUser} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
