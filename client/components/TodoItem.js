import classnames from 'classnames';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as TodoActions from '../actions';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

class TodoItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      editText: this.props.todo.get('title'),
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit() {
    const val = this.state.editText.trim();
    if (val) {
      this.props.actions.editTodo(this.props.userId, this.props.todo.get('todoId'), val);
      this.setState({ editing: false, editText: val });
    } else {
      this.props.actions.deleteTodo(this.props.userId, this.props.todo.get('todoId'));
    }
  }

  handleEdit() {
    this.setState({ editing: true, editText: this.props.todo.get('title') });
    const node = this.refs.editField;
    node.focus();
    node.setSelectionRange(node.value.length, node.value.length);
  }

  handleKeyDown(event) {
    if (event.which === ESCAPE_KEY) {
      this.setState({ editing: false, editText: this.props.todo.get('title') });
    } else if (event.which === ENTER_KEY) {
      this.handleSubmit();
    }
  }

  handleChange(event) {
    this.setState({ editText: event.target.value });
  }

  render() {
    const itemClass = classnames({
      completed: this.props.todo.get('completed'),
      editing: this.state.editing,
      pendingUpdate: this.props.todo.get('pendingUpdate'),
      pendingRemoval: this.props.todo.get('pendingRemoval'),
    });
    return (
      <li className={itemClass}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.todo.get('completed')}
            onChange={() => {
              this.props.actions.toggleTodo(this.props.userId, this.props.todo.toJS());
            }}
          />
          <label onDoubleClick={this.handleEdit}>
            {this.props.todo.get('title')}
          </label>
          <button
            className="destroy"
            onClick={() => {
              this.props.actions.deleteTodo(this.props.userId, this.props.todo.get('todoId'));
            }}
          />
        </div>
        <input
          ref="editField"
          className="edit"
          value={this.state.editText}
          onBlur={this.handleSubmit}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
      </li>
    );
  }
}
TodoItem.propTypes = {
  userId: PropTypes.string,
  todo: ImmutablePropTypes.map,
  actions: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(TodoActions, dispatch),
});

export default connect(
  () => ({}),
  mapDispatchToProps
)(TodoItem);
