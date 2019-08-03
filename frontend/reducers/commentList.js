import {LOAD_COMMENT_LIST, ADD_COMMENT, ADD_REPLY, EDIT_COMMENT, EDIT_REPLY, DELETE_COMMENT, DELETE_REPLY} from '../actions/types';


// comments reducer which modifies the state depending on action type
// state = [] is initial state
export default function (state = [], action) {
  switch (action.type) {
    case LOAD_COMMENT_LIST:
      return action.payload;
    case ADD_COMMENT:
      return [...state, action.payload];
    case ADD_REPLY:
      const parentIndex = state.findIndex(comment => comment.id === action.payload.parent);
      // deepcopy state
      return state.map((element, index) => {
        if (index === parentIndex) {
          return {...element, replies: [...element.replies, action.payload]}
        } else {
          return element
        }
      });
    case EDIT_COMMENT:
      const commentIndex = state.findIndex(comment => comment.id === action.payload.id);

      return state.map((element, index) => {
        if (index === commentIndex) {
          return action.payload
        } else {
          return element
        }
      });
    case EDIT_REPLY:
      // 2 is added to the variable name since you cannot redeclare constants
      // find comment index
      const parentIndex2 = state.findIndex(comment => comment.id === action.payload.parent);
      // deepcopy state
      return state.map((element, index) => {
        if (index === parentIndex2) {
          // find reply index
          const replyIndex = element.replies.findIndex(reply => reply.id === action.payload.id);
          // copy replies and insert updated reply
          const updatedReplies = element.replies.map((elem, idx) => {
            if (idx === replyIndex) {
              return action.payload
            } else {
              return elem
            }
          });
          return {...element, replies: updatedReplies}
        } else {
          return element
        }
      });
    case DELETE_COMMENT:
      return state.filter(comment => comment.id !== action.payload);
    case DELETE_REPLY:
      // 3 is added to the variable name since you cannot redeclare constants
      // find comment index
      const parentIndex3 = state.findIndex(comment => comment.id === action.payload.parent_id);
      return state.map((element, index) => {
        if (index === parentIndex3) {
          // copy replies and delete reply
          const updatedReplies = element.replies.filter(reply => reply.id !== action.payload.comment_id);
          return {...element, replies: updatedReplies}
        } else {
          return element
        }
      });
    default:
      return state
  }
}


// deep copy of object let b = JSON.parse(JSON.stringify(a)) - only works with native JS data types
// https://www.freecodecamp.org/news/copying-stuff-in-javascript-how-to-differentiate-between-deep-and-shallow-copies-b6d8c1ef09cd/
