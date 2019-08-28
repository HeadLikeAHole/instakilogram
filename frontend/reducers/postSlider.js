import {
  CURRENT_POST_ID,
  POST_SLIDER_LOADING,
  POST_SLIDER_LOADED,
  POST_SLIDER_MORE_LOADED,
  POST_SLIDER_ERROR,
  REMOVE_POST_SLIDER
} from '../actions/types';


const initialState = {
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
    case POST_SLIDER_ERROR:
      return {...state, isLoading: false};
    case REMOVE_POST_SLIDER:
      return initialState;
    default:
      return state
  }
}
