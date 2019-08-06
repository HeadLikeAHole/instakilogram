import { PROFILE_LOADING, PROFILE_LOADED } from '../actions/types';


const initialState = {
  isLoading: false,
  profileData: {}
};


export default function (state = initialState, action) {
  switch (action.type) {
    case PROFILE_LOADING:
      return {...state, isLoading: true};
    case PROFILE_LOADED:
      return {...state, isLoading: false, profileData: action.payload};
    default:
      return state
  }
}
