import api from '../../common/api';
import * as types from '../../common/ActionTypes';

const postAndReturn = (actionObject) => {
  api.postAction(actionObject);
  return actionObject;
};

export function onFirebaseValue(dataSnapshot) {
  return { type: types.SERVER_UPDATE, dataSnapshot };
}

export function updateAllocation(val) {
  return postAndReturn({ type: types.UPDATE_ALLOCATION, val });
}
