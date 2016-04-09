import React from 'react';
import ReactDOM from 'react-dom';

// import TodoModel from './todoModel';
import TodoApp from './App';

if (module.hot) {
  module.hot.accept();
}

// const model = new TodoModel('todos');

ReactDOM.render(
  <TodoApp />,
  document.getElementById('root')
);
