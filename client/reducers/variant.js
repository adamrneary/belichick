import { SERVER_UPDATE } from '../../common/ActionTypes';

export default function todos(state = 'light', action) {
  if (action.type === SERVER_UPDATE) {
    return action.dataSnapshot.val().variant || 'light';
  }
  return state;
}
