import {
  PROFILE_LOADING,
  PROFILE_LOADED,
  UPDATE_PROFILE,
  PROFILE_ERROR,
  REMOVE_PROFILE
} from '../actions/types';


const initialState = {
  isLoading: false,
  profileData: {}
};


export default function (state = initialState, action) {
  switch (action.type) {
    case PROFILE_LOADING:
      return {...state, isLoading: true};
    case PROFILE_LOADED:
      return {isLoading: false, profileData: action.payload};
    // update profile' followers count when following and unfollowing this profile
    case UPDATE_PROFILE:
      return {...state, profileData: {...state.profileData, followers_count: action.payload.followers_count, following_count: action.payload.following_count}};
    case PROFILE_ERROR:
      return {...state, isLoading: false};
    case REMOVE_PROFILE:
      return initialState;
    default:
      return state
  }
}
