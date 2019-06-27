import { LOAD_POST_LIST, ADD_POST, DELETE_POST } from '../actions/types';


// posts reducer which modifies the state depending on action type
// state = [] is initial state
export default function (state = [], action) {
  switch (action.type) {
    case LOAD_POST_LIST:
      return action.payload;
    case ADD_POST:
      return [...state, action.payload];
    case DELETE_POST:
      // filter out deleted post specified in payload which is id of the post
      return state.filter(post => post.id !== action.payload);
    default:
      return state
  }
}
