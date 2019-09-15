import {
  CURRENT_POST_ID,
  POST_SLIDER_LOADING,
  POST_SLIDER_LOADED,
  POST_SLIDER_MORE_LOADED,
  DELETE_SLIDER_POST,
  POST_SLIDER_ERROR,
  REMOVE_POST_SLIDER
} from '../actions/types';


const initialState = {
  // id is the current post's id displayed in the post slider
  id: null,
  isLoading: false,
  count: null,
  next: null,
  previous: null,
  posts: []
};


export default function (state = initialState, action) {
  switch (action.type) {
    case CURRENT_POST_ID:
      return {...state, id: action.payload};
    case POST_SLIDER_LOADING:
      return {...state, isLoading: true};
    case POST_SLIDER_LOADED:
      return {
        ...state, isLoading: false,
        count: action.payload.count,
        next: action.payload.next,
        previous: action.payload.previous,
        posts: [...action.payload.posts]
      };
    case POST_SLIDER_MORE_LOADED:
      return {
        ...state, isLoading: false,
        count: action.payload.count,
        next: action.payload.next,
        previous: action.payload.previous,
        posts: [...state.posts, ...action.payload.posts]
      };
    case DELETE_SLIDER_POST:
      // filter out deleted post id of which is sent in payload
      const updatedPosts =  state.posts.filter(post => post.id !== action.payload);
      return {...state, posts: [...updatedPosts]};
    case POST_SLIDER_ERROR:
      return {...state, isLoading: false};
    case REMOVE_POST_SLIDER:
      return initialState;
    default:
      return state
  }
}
