const Nightmare = require('nightmare');
const _ = require('lodash');

const nightmare = new Nightmare({ show: true });

const createUser = (createCount) => {
  nightmare
    .goto('http://localhost:3000/')
    .wait('#new-todo');

  _.range(1, createCount).forEach(i => {
    nightmare.type('#new-todo', `todo ${i}\r`);
  });

  nightmare
    .wait('#todo-list li:first-child .toggle')
    .click('#todo-list li:first-child .toggle');
};

_.range(1000).forEach(() => {
  createUser(1 + Math.round(Math.random() * 10));
});

nightmare.evaluate(() => document.querySelector('#new-todo').placeholder)
  .end()
  .then(result => {
    console.log(result);
  });
