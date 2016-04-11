import {
  SERVER_UPDATE,
  // ADD_TODO, DELETE_TODO, EDIT_TODO, TOGGLE_TODO, COMPLETE_ALL, CLEAR_COMPLETED,
} from '../constants/ActionTypes';

export default function todos(state = {}, action) {
  switch (action.type) {
    case SERVER_UPDATE:
      return action.dataSnapshot.val();

    // case ADD_TODO:
    //   return [
    //     {
    //       id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
    //       completed: false,
    //       text: action.text,
    //     },
    //     ...state,
    //   ];
    //
    // case DELETE_TODO:
    //   return state.filter(todo =>
    //     todo.id !== action.id
    //   );
    //
    // case EDIT_TODO:
    //   return state.map(todo =>
    //     todo.id === action.id ?
    //       Object.assign({}, todo, { text: action.text }) :
    //       todo
    //   );
    //
    // case TOGGLE_TODO:
    //   return state.map(todo =>
    //     todo.id === action.id ?
    //       Object.assign({}, todo, { completed: !todo.completed }) :
    //       todo
    //   );
    //
    // case COMPLETE_ALL:
    //   const areAllMarked = state.every(todo => todo.completed)
    //   return state.map(todo => Object.assign({}, todo, {
    //     completed: !areAllMarked
    //   }));
    //
    // case CLEAR_COMPLETED:
    //   return state.filter(todo => todo.completed === false);

    default:
      return state;
  }
}
