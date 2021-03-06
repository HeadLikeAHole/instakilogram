import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_SAVE_POST,
  USER_FOLLOW,
  UPDATE_PROFILE
} from '../actions/types';
import { createMessage, returnErrors } from './messages';


// helper function which composes headers
// by default it adds "'Content-Type': 'application/json'" to the header
// if second argument is false it doesn't
export const composeHeaders = (getState, json=true) => {
  // get token from state
  // getState() returns the current state tree of your application.
  // It is equal to the last value returned by the store's reducer
  // It's a redux function
  const headers = {};
  const token = getState().auth.token;
  if (json) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Token ${token}`
  }
  return headers
};


// check token and get user
export const loadUser = () => (dispatch, getState) => {
  // user loading
  dispatch({ type: USER_LOADING });
  fetch('api/accounts/user/', {headers: composeHeaders(getState)})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then(data => {
      dispatch({
        type: USER_LOADED,
        payload: data
      })
    }).catch(error => {
        dispatch(returnErrors(error.statusText, error.status));
        dispatch({type: AUTH_ERROR});
  })
};


// register user
// pass in an object as single parameter to register function
// which then gets destructured
export const register = ({ username, password, email }) => dispatch => {
  const body = JSON.stringify({ username, password, email }); // Object Property Value Shorthand
  const headers = {'Content-Type': 'application/json'};
  fetch('api/accounts/register/', {method: 'POST', body: body, headers: headers})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw response
      }
    })
    .then(data => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: data
      });
      dispatch(createMessage({register: 'Аккаунт был создан'}));
    }).catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
      dispatch({
        type: REGISTER_FAIL
      })
  })
};


// login user
export const login = (username, password) => dispatch => {
  const body = JSON.stringify({ username, password }); // Object Property Value Shorthand
  const headers = {'Content-Type': 'application/json'};
  fetch('api/accounts/login/', {method: 'POST', body: body, headers: headers})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw response
      }
    })
    .then(data => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: data
      })
    }).catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
      dispatch({
        type: LOGIN_FAIL
      })
  })
};


// logout user
export const logout = history => (dispatch, getState) => {
  fetch('api/accounts/logout/', {method: 'POST', body: null, headers: composeHeaders(getState)})
    .then(() => {
      dispatch({type: LOGOUT_SUCCESS});
      dispatch(createMessage({logout: 'Вы вышли из аккаунта'}));
      // this function should be after dispatching LOGOUT_SUCCESS action
      // so logged out user doesn't see empty feed of authenticated user
      history.push('/');
    })
    .catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
    })
};


// save post
export const savePost = post_id => (dispatch, getState) => {
  fetch(`api/posts/${post_id}/save/`, {headers: composeHeaders(getState)})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(savedPostsIds => dispatch({type: USER_SAVE_POST, payload: savedPostsIds}))
    .catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
    })
};


export const follow = (authUser_id, profile_id, page) => (dispatch, getState) => {
  fetch(`api/accounts/user/${authUser_id}/follow/${profile_id}/`, {headers: composeHeaders(getState)})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(data => dispatch({type: USER_FOLLOW, payload: data.following}))
    .then(() => {
      if (page) {
        let url;
        if (page === 'profile') {
          url = `api/accounts/profile/${profile_id}/`
        } else {
          url = `api/accounts/profile/${authUser_id}/`
        }
        fetch(url, {headers: composeHeaders(getState)})
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
           throw response;
          }
        })
        .then(profile => dispatch({type: UPDATE_PROFILE, payload: profile}))
      }
    }).catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
    })
};


// send your email address so server can send there instruction for password reset
export const sendEmailAddress = (email, toggleModal) => dispatch => {
  const body = JSON.stringify({ email }); // Object Property Value Shorthand
  const headers = {'Content-Type': 'application/json'};
  fetch('api/accounts/password-reset/', {method: 'POST', body: body, headers: headers})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw response
      }
    })
    // show modal which tells user that server sent e-mail to his e-mail address with password reset instructions
    .then(() => toggleModal())
    .catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
  })
};


export const sendNewPassword = (password, token, history) => dispatch => {
  const body = JSON.stringify({ password, token }); // Object Property Value Shorthand
  const headers = {'Content-Type': 'application/json'};
  fetch('api/accounts/password-reset/confirm/', {method: 'POST', body: body, headers: headers})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw response
      }
    })
    // show modal which tells user that server sent e-mail to his e-mail address with password reset instructions
    .then(() => {
      history.push('/login');
      dispatch(createMessage({passwordReset: 'Новый пароль был установлен'}));
    })
    .catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
  })
};