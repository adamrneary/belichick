import { each, filter, map } from 'lodash';
import React, { PropTypes } from 'react';

import api from '../api';
import TodoItem from './TodoItem';

const Todos = ({ items, activeTodoCount, nowShowing }) => {
  const shownTodos = filter(items, item => {
    switch (nowShowing) {
      case 'active':
        return !item.completed;
      case 'completed':
        return item.completed;
      default:
        return true;
    }
  });
  return (
    <section id={'main'}>
      <input
        id={'toggle-all'}
        type={'checkbox'}
        onChange={() => { each(items, api.todos.toggle); }}
        checked={activeTodoCount === 0}
      />
			<ul id={'todo-list'}>
				{map(shownTodos, todo => <TodoItem key={todo.id} todo={todo} />)}
			</ul>
		</section>
  );
};
Todos.propTypes = {
  items: PropTypes.object,
  activeTodoCount: PropTypes.number,
  nowShowing: PropTypes.string,
};

export default Todos;
