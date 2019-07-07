import { CURRENT_POST_ID, POSTS_TO_DISPLAY } from '../actions/types';


const initialState = {
  id: null,
  posts: []
};


export default function (state = initialState, action) {
  switch (action.type) {
    case CURRENT_POST_ID:
      return {...state, id: action.payload};
    case POSTS_TO_DISPLAY:
      return {...state, posts: action.payload};
    default:
      return state
  }
}
