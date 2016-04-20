import ImmutablePropTypes from 'react-immutable-proptypes';
import React, { PropTypes } from 'react';

import TodoItem from './TodoItem';

const Todos = ({ userId, todos, activeTodoCount, nowShowing, toggleTodo }) => {
  const shownTodos = todos.filter(todo => {
    switch (nowShowing) {
      case 'active':
        return !todo.get('completed');
      case 'completed':
        return todo.get('completed');
      default:
        return true;
    }
  }).toList();
  return (
    <section id={'main'}>
      <input
        id={'toggle-all'}
        type={'checkbox'}
        onChange={() => { todos.each(toggleTodo); }}
        checked={activeTodoCount === 0}
      />
			<ul id={'todo-list'}>
				{
          shownTodos.map(todo =>
            <TodoItem key={todo.get('todoId')} todo={todo} userId={userId} />
          ).toJS()
        }
			</ul>
		</section>
  );
};
Todos.propTypes = {
  userId: PropTypes.string,
  todos: ImmutablePropTypes.map,
  activeTodoCount: PropTypes.number,
  nowShowing: PropTypes.string,
  toggleTodo: PropTypes.func,
};

export default Todos;
