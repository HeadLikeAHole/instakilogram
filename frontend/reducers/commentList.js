import {
  COMMENT_LIST_LOADING,
  COMMENT_LIST_LOADED,
  COMMENT_LIST_MORE_LOADED,
  COMMENT_LIST_ERROR,
  REPLIES_LIST_LOADING,
  REPLIES_LIST_LOADED,
  REPLIES_LIST_ERROR,
  ADD_COMMENT,
  ADD_REPLY,
  UPDATE_COMMENT,
  UPDATE_REPLY,
  DELETE_COMMENT,
  DELETE_REPLY
} from '../actions/types';


const initialState = {
  commentsLoading: false,
  repliesLoading: false,
  count: null,
  next: null,
  previous: null,
  comments: []
};


// comment list reducer which modifies the state depending on action type
export default function (state = initialState, action) {
  switch (action.type) {
    case COMMENT_LIST_LOADING:
      return {...state, commentsLoading: true};
    case COMMENT_LIST_LOADED:
      return {...state, commentsLoading: false, ...action.payload};
    case COMMENT_LIST_MORE_LOADED:
      return {
        ...state, commentsLoading: false,
        count: action.payload.count,
        next: action.payload.next,
        previous: action.payload.previous,
        comments: [...state.comments, ...action.payload.comments]
      };
    case REPLIES_LIST_LOADING:
      return {...state, repliesLoading: true};
    case REPLIES_LIST_LOADED: {
      const commentIndex = state.comments.findIndex(comment => comment.id === action.payload.id);
      // deepcopy state
      const updatedComments = state.comments.map((element, index) => {
        if (index === commentIndex) {
          return {...element, replies: [...element.replies, ...action.payload.replies]}
        } else {
          return element
        }
      });
      return {...state, repliesLoading: false, comments: [...updatedComments]};
    }
    case ADD_COMMENT:
      return {...state, comments: [action.payload, ...state.comments]};
    case ADD_REPLY: {
      const parentIndex = state.comments.findIndex(comment => comment.id === action.payload.parent);
      // deepcopy state
      const updatedComments =  state.comments.map((element, index) => {
        if (index === parentIndex) {
          return {...element, replies: [...element.replies, action.payload], replies_count: element.replies_count + 1}
        } else {
          return element
        }
      });
      return {...state, comments: [...updatedComments]};
    }
    case UPDATE_COMMENT: {
      const commentIndex = state.comments.findIndex(comment => comment.id === action.payload.id);
      const updatedComments = state.comments.map((element, index) => {
        if (index === commentIndex) {
          return action.payload
        } else {
          return element
        }
      });
      return {...state, comments: [...updatedComments]};
    }
    case UPDATE_REPLY: {
      // find comment index
      const parentIndex = state.comments.findIndex(comment => comment.id === action.payload.parent);
      // deepcopy state
      const updatedComments = state.comments.map((element, index) => {
        if (index === parentIndex) {
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
      return {...state, comments: [...updatedComments]};
    }
    case DELETE_COMMENT: {
      const updatedComments = state.comments.filter(comment => comment.id !== action.payload);
      return {...state, comments: [...updatedComments]};
    }
    case DELETE_REPLY: {
      // find comment index
      const parentIndex = state.comments.findIndex(comment => comment.id === action.payload.parent_id);
      const updatedComments = state.comments.map((element, index) => {
        if (index === parentIndex) {
          // copy replies and delete reply
          const updatedReplies = element.replies.filter(reply => reply.id !== action.payload.comment_id);
          return {...element, replies: updatedReplies}
        } else {
          return element
        }
      });
      return {...state, comments: [...updatedComments]};
    }
    case COMMENT_LIST_ERROR:
      return {...state, commentsLoading: false};
    case REPLIES_LIST_ERROR:
      return {...state, repliesLoading: false};
    default:
      return state
  }
}


// deep copy of object let b = JSON.parse(JSON.stringify(a)) - only works with native JS data types
// https://www.freecodecamp.org/news/copying-stuff-in-javascript-how-to-differentiate-between-deep-and-shallow-copies-b6d8c1ef09cd/
