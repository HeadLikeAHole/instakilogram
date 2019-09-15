import {
  POST_LIST_LOADING,
  POST_LIST_LOADED,
  POST_LIST_MORE_LOADED,
  UPDATE_POST,
  DELETE_POST,
  POST_LIST_ERROR,
  REMOVE_POST_LIST
} from '../actions/types';


const initialState = {
  isLoading: false,
  count: null,
  next: null,
  previous: null,
  posts: []
};


export default function (state = initialState, action) {
  switch (action.type) {
    case POST_LIST_LOADING:
      return {...state, isLoading: true};
    case POST_LIST_LOADED:
      return {isLoading: false, ...action.payload};
    case POST_LIST_MORE_LOADED:
      return {
        ...state, isLoading: false,
        count: action.payload.count,
        next: action.payload.next,
        previous: action.payload.previous,
        posts: [...state.posts, ...action.payload.posts]
      };
    // update post when post is liked if post is edited no need to update it
    // since after successful edit you are redirected to home page and post list is loaded again
    case UPDATE_POST: {
      const updatedPosts = state.posts.map(post => {
        if (post.id === action.payload.id) {
          return action.payload
        } else {
          return post
        }
      });
      return {...state, posts: [...updatedPosts]};
    }
    case DELETE_POST: {
      // filter out deleted post id of which is sent in payload
      const updatedPosts =  state.posts.filter(post => post.id !== action.payload);
      return {...state, posts: [...updatedPosts]};
    }
    case POST_LIST_ERROR:
      return {...state, isLoading: false};
    case REMOVE_POST_LIST:
      return initialState;
    default:
      return state
  }
}
