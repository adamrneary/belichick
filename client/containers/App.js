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
    this.subscribe = this.subscribe.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearCompleted = this.clearCompleted.bind(this);
  }

  componentWillMount() {
    this.subscribe(this.props.params.userId);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.params.userId !== this.props.params.userId) {
      this.firebaseRef.off();
      this.subscribe(newProps.params.userId);
    }
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  subscribe(userId) {
    this.firebaseRef = new Firebase(`${config.firebaseUrl}/users/${userId}/`);
    this.firebaseRef.on('value', this.props.actions.onFirebaseValue);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.text && this.state.text.trim().length !== 0) {
      this.props.actions.addTodo(this.props.params.userId, this.state.text.trim());
      this.setState({ text: '' });
    }
  }

  clearCompleted() {
    each((this.props.serverState.todos || {}), item => {
      if (item.completed) {
        this.props.actions.deleteTodo(this.props.params.userId, item.id);
      }
    });
  }

  render() {
    const { serverState, actions } = this.props;
    const { variant } = serverState;
    const todos = serverState.todos || {};
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
      <div className={variant}>
        <Header
          text={this.state.text}
          onChange={(e) => {this.setState({ text: e.target.value }); }}
          handleSubmit={this.handleSubmit}
        />
        <Todos
          userId={this.props.params.userId}
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
  params: PropTypes.object.isRequired,
  serverState: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  serverState: state.serverState,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(TodoActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
