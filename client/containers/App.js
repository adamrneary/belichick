import Firebase from 'firebase';
import { each, reduce } from 'lodash';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as TodoActions from '../actions';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Todos from '../components/Todos';
import config from '../../config';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      .on('value', this.props.actions.onFirebaseValue);
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.text && this.state.text.trim().length !== 0) {
      this.props.actions.addTodo(this.state.text.trim());
      this.setState({ text: '' });
    }
  }

  clearCompleted() {
    each(this.props.todos, item => {
      if (item.completed) {
        this.props.actions.deleteTodo(item.id);
      }
    });
  }

  render() {
    const { todos, actions } = this.props;
    const activeTodoCount = reduce(todos, (accum, todo) =>
      (todo.completed ? accum : accum + 1)
    , 0);
    const completedCount = Object.keys(todos).length - activeTodoCount;
    const footer = !Object.keys(todos).length ? undefined : (
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
          items={todos}
          activeTodoCount={activeTodoCount}
          nowShowing={this.state.nowShowing}
          {...actions}
        />
        {footer}
      </div>
    );
  }
}
App.propTypes = {
  todos: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  todos: state.todos,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(TodoActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
