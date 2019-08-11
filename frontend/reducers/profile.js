import { LOAD_PROFILE, UPDATE_PROFILE_POSTS } from '../actions/types';


export default function (state = {}, action) {
  switch (action.type) {
    case LOAD_PROFILE:
      return action.payload;
    // update user's post in profile page when post is deleted in post detail modal
    case UPDATE_PROFILE_POSTS:
      const postIndex = state.user_posts.findIndex(post => post.id === action.payload);
      const newUserPosts = state.user_posts.filter((element, index) => index !== postIndex);
      return {...state, user_posts: newUserPosts};
    default:
      return state
  }
}
