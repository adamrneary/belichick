import Firebase from 'firebase';
import { map, reduce } from 'lodash';
import React, { PropTypes } from 'react';

import api from './api';
import config from './config';
import TodoItem from './TodoItem';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      text: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
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

  render() {
    return (
      <div>
        <Header
          text={this.state.text}
          onChange={(e) => {this.setState({ text: e.target.value }); }}
          handleSubmit={this.handleSubmit}
        />
        <Main items={this.state.items} />
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

const Main = ({ items }) => {
  const activeTodoCount = reduce(items, (accum, todo) =>
    (todo.completed ? accum : accum + 1)
  , 0);
  return (
    <section id={'main'}>
      <input
        id={'toggle-all'}
        type={'checkbox'}
        onChange={() => { items.forEach(api.todos.toggle); }}
        checked={activeTodoCount === 0}
      />
			<ul id={'todo-list'}>
				{map(items, todo => <TodoItem key={todo.id} todo={todo} />)}
			</ul>
		</section>
  );
};
Main.propTypes = {
  items: PropTypes.object,
};

export default App;
