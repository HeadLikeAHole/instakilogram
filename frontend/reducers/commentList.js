import { LOAD_COMMENT_LIST, ADD_COMMENT, ADD_REPLY } from '../actions/types';


// comments reducer which modifies the state depending on action type
// state = [] is initial state
export default function (state = [], action) {
  switch (action.type) {
    case LOAD_COMMENT_LIST:
      return action.payload;
    case ADD_COMMENT:
      return [...state, action.payload];
    case ADD_REPLY:
      // deep copy of state
      const parentIndex = state.findIndex(comment => comment.id === action.payload.parent_id);
      const newState = state.map((element, index) => {
        if (index === parentIndex) {
          return {...element, replies: [...element.replies, action.payload.data]}
        } else {
          return element
        }
      });
      return newState;
    default:
      return state
  }
}


// deep copy of object let b = JSON.parse(JSON.stringify(a)) - only works with native JS data types
// https://www.freecodecamp.org/news/copying-stuff-in-javascript-how-to-differentiate-between-deep-and-shallow-copies-b6d8c1ef09cd/
