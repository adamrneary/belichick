import classnames from 'classnames';
import React, { PropTypes } from 'react';

import api from '../api';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

class TodoItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      editText: this.props.todo.title,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit() {
    const val = this.state.editText.trim();
    if (val) {
      api.todos.update(this.props.userId, this.props.todo.id, val);
      this.setState({ editing: false, editText: val });
    } else {
      api.todos.delete(this.props.userId, this.props.todo.id);
    }
  }

  handleEdit() {
    this.setState({ editing: true, editText: this.props.todo.title });
    const node = this.refs.editField;
    node.focus();
    node.setSelectionRange(node.value.length, node.value.length);
  }

  handleKeyDown(event) {
    if (event.which === ESCAPE_KEY) {
      this.setState({ editing: false, editText: this.props.todo.title });
    } else if (event.which === ENTER_KEY) {
      this.handleSubmit();
    }
  }

  handleChange(event) {
    this.setState({ editText: event.target.value });
  }

  render() {
    const itemClass = classnames({
      completed: this.props.todo.completed,
      editing: this.state.editing,
    });
    return (
      <li className={itemClass}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.todo.completed}
            onChange={() => {api.todos.toggle(this.props.userId, this.props.todo); }}
          />
          <label onDoubleClick={this.handleEdit}>
            {this.props.todo.title}
          </label>
          <button
            className="destroy"
            onClick={() => {api.todos.delete(this.props.userId, this.props.todo.id); }}
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
  todo: PropTypes.object,
};

export default TodoItem;
