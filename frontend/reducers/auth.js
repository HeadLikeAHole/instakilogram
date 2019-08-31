import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  PASSWORD_CHANGE_SUCCESS,
  USER_SAVE_POST,
  USER_FOLLOW,
  USER_UPDATE,
  DELETE_PROFILE_SUCCESS
} from '../actions/types';


const initialState = {
  token: localStorage.getItem('token'),
  // set isLoading to true by default so on page reload user while being logged in
  // isn't redirected by PrivateRoute to login page and then immediately to home page
  // explained here:
  // https://stackoverflow.com/questions/49091416/refresh-on-protected-routes-react-router-with-firebase-auth
  isLoading: true,
  isAuthenticated: false,
  user: {}
};


export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {...state, isLoading: true};
    case USER_LOADED:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
    case PASSWORD_CHANGE_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        isAuthenticated: true,
      };
    // resets state to default
    case AUTH_ERROR:
    // do the same thing as above
    case LOGIN_FAIL:
    // again in this case everything is set to default (cleared out)
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
    case DELETE_PROFILE_SUCCESS:
      localStorage.removeItem('token');
      return {
        ...state,
          isLoading: false,
          isAuthenticated: false,
          user: {}
      };
    case USER_SAVE_POST:
      return {...state, user: {...state.user, saved_posts: action.payload}};
    case USER_FOLLOW:
      return {...state, user: {...state.user, following: action.payload}};
    // update authenticated user after profile edit (change username or avatar without page reload)
    case USER_UPDATE:
      return {...state, user: {...state.user, ...action.payload}};
    default:
      return state
  }
}
