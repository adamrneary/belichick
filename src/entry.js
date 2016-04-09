import React from 'react';
import ReactDOM from 'react-dom';

import TodoApp from './components/App';

if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(
  <TodoApp />,
  document.getElementById('root')
);
