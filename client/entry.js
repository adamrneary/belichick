import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import TodoApp from './containers/App';
import configureStore from './store/configureStore';
import './static/base.css';

const store = configureStore();

if (module.hot) {
  module.hot.accept();
}

render(
  <Provider store={store}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);
