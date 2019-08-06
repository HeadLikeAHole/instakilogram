import { LOAD_POST_LIST, ADD_POST, UPDATE_POST, DELETE_POST } from '../actions/types';


// posts reducer which modifies the state depending on action type
// state = [] is initial state
export default function (state = [], action) {
  switch (action.type) {
    case LOAD_POST_LIST:
      return action.payload;
    case ADD_POST:
      return [...state, action.payload];
    // update post when post is liked if post is edited no need to update it
    // since after successful edit you are redirected to home page and post list is loaded again
    case UPDATE_POST:
      return state.map(post => {
        if (post.id === action.payload.id) {
          return action.payload
        } else {
          return post
        }
      });
    case DELETE_POST:
      // filter out deleted post specified in payload which is id of the post
      return state.filter(post => post.id !== action.payload);
    default:
      return state
  }
}
