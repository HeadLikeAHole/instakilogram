import { ADD_COMMENT_FORM_INFO, REMOVE_COMMENT_FORM_INFO } from '../actions/types';


export default function (state = {}, action) {
  switch (action.type) {
    case ADD_COMMENT_FORM_INFO:
      return action.payload;
    case REMOVE_COMMENT_FORM_INFO:
      return {};
    default:
      return state
  }
}
