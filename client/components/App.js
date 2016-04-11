import classnames from 'classnames';
import Firebase from 'firebase';
import { each, reduce } from 'lodash';
import React, { PropTypes } from 'react';

import api from '../api';
import config from '../../config';
import Todos from './Todos';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      text: '',
      nowShowing: 'all',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearCompleted = this.clearCompleted.bind(this);
  }

  componentWillMount() {
    this.firebaseRef = new Firebase(`${config.firebaseUrl}todos/`);
    this.firebaseRef
      .orderByPriority()
      .limitToLast(25)
      .on('value', dataSnapshot => {
        this.setState({ items: dataSnapshot.val() });
      });
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.text && this.state.text.trim().length !== 0) {
      api.todos.create(this.state.text.trim());
      this.setState({ text: '' });
    }
  }

  clearCompleted() {
    each(this.state.items, item => {
      if (item.completed) {
        api.todos.delete(item.id);
      }
    });
  }

  render() {
    const activeTodoCount = reduce(this.state.items, (accum, todo) =>
      (todo.completed ? accum : accum + 1)
    , 0);
    const completedCount = Object.keys(this.state.items).length - activeTodoCount;
    const footer = !Object.keys(this.state.items).length ? undefined : (
      <Footer
        count={activeTodoCount}
        completedCount={completedCount}
        nowShowing={this.state.nowShowing}
        onClearCompleted={this.clearCompleted}
        handleShowFilter={(val) => {this.setState({ nowShowing: val }); }}
      />
  );

    return (
      <div>
        <Header
          text={this.state.text}
          onChange={(e) => {this.setState({ text: e.target.value }); }}
          handleSubmit={this.handleSubmit}
        />
        <Todos
          items={this.state.items}
          activeTodoCount={activeTodoCount}
          nowShowing={this.state.nowShowing}
        />
        {footer}
      </div>
    );
  }
}

const Header = ({ text, onChange, handleSubmit }) => (
  <header id="header">
    <h1>todos</h1>
    <form onSubmit={handleSubmit}>
      <input
        id="new-todo"
        placeholder="What needs to be done?"
        value={text}
        onChange={onChange}
        autoFocus
      />
    </form>
  </header>
);
Header.propTypes = {
  text: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

const Footer = ({ count, completedCount, onClearCompleted, nowShowing, handleShowFilter }) => {
  const activeTodoWord = count === 1 ? 'item' : 'items';
  const clearButton = completedCount && completedCount === 0 ? undefined : (
    <button id="clear-completed" onClick={onClearCompleted}>
      Clear completed ({completedCount})
    </button>
  );

  return (
    <footer id="footer">
      <span id="todo-count">
        <strong>{count}</strong> {activeTodoWord} left
      </span>
      <ul id="filters">
        <Filter
          val="all"
          label="All"
          nowShowing={nowShowing}
          handleShowFilter={handleShowFilter}
        />
        {' '}
        <Filter
          val="active"
          label="Active"
          nowShowing={nowShowing}
          handleShowFilter={handleShowFilter}
        />
        {' '}
        <Filter
          val="completed"
          label="Completed"
          nowShowing={nowShowing}
          handleShowFilter={handleShowFilter}
        />
      </ul>
      {clearButton}
    </footer>
  );
};
Footer.propTypes = {
  count: PropTypes.number,
  completedCount: PropTypes.number,
  nowShowing: PropTypes.string,
  onClearCompleted: PropTypes.func,
  handleShowFilter: PropTypes.func,
  passProps: PropTypes.object,
};

const Filter = ({ val, label, handleShowFilter, nowShowing }) => (
  <li>
    <a
      href="#"
      onClick={() => {handleShowFilter(val); }}
      className={classnames({ selected: nowShowing === val })}
    >
      {label}
    </a>
  </li>
);
Filter.propTypes = {
  val: PropTypes.string,
  label: PropTypes.string,
  nowShowing: PropTypes.string,
  handleShowFilter: PropTypes.func,
};

export default App;
