import classnames from 'classnames';
import React, { PropTypes } from 'react';

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

export default Footer;
