import { LOAD_PROFILE, UPDATE_PROFILE, UPDATE_PROFILE_POSTS, REMOVE_PROFILE } from '../actions/types';


export default function (state = {}, action) {
  switch (action.type) {
    case LOAD_PROFILE:
      return action.payload;
    // update profile' followers count when following and unfollowing this profile
    case UPDATE_PROFILE:
      return {...state, followers_count: action.payload.followers_count, following_count: action.payload.following_count};
    // update user's post in profile page when post is deleted in post detail modal
    case UPDATE_PROFILE_POSTS:
      const postIndex = state.user_posts.findIndex(post => post.id === action.payload);
      const newUserPosts = state.user_posts.filter((element, index) => index !== postIndex);
      return {...state, user_posts: newUserPosts};
    case REMOVE_PROFILE:
      return {};
    default:
      return state
  }
}
