import React, { PropTypes } from 'react';

const Header = ({ text, variant, onChange, handleSubmit }) => (
  <header id="header">
    <h1>Todos <small>(Solarized {variant})</small></h1>
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
  variant: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default Header;
