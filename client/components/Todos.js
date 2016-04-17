import { each, filter, map } from 'lodash';
import React, { PropTypes } from 'react';

import TodoItem from './TodoItem';

const Todos = ({ userId, items, activeTodoCount, nowShowing, toggleTodo }) => {
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
        onChange={() => { each(items, toggleTodo); }}
        checked={activeTodoCount === 0}
      />
			<ul id={'todo-list'}>
				{map(shownTodos, todo => <TodoItem key={todo.todoId} todo={todo} userId={userId} />)}
			</ul>
		</section>
  );
};
Todos.propTypes = {
  userId: PropTypes.string,
  items: PropTypes.object,
  activeTodoCount: PropTypes.number,
  nowShowing: PropTypes.string,
  toggleTodo: PropTypes.func,
};

export default Todos;
