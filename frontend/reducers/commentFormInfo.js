import { ADD_COMMENT_FORM_INFO } from '../actions/types';


export default function (state = {}, action) {
  switch (action.type) {
    case ADD_COMMENT_FORM_INFO:
      return action.payload;
    default:
      return state
  }
}
