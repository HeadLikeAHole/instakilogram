import { LOAD_POST_DETAIL, UPDATE_POST_DETAIL } from '../actions/types';


export default function (state = {}, action) {
  switch (action.type) {
    case LOAD_POST_DETAIL:
    case UPDATE_POST_DETAIL:
      return action.payload;
    default:
      return state
  }
}
