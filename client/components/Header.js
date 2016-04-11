import React, { PropTypes } from 'react';

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

export default Header;
