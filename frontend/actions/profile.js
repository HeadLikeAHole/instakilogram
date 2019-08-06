import { PROFILE_LOADING, PROFILE_LOADED } from './types';
import { createMessage, returnErrors } from './messages';
import { composeHeaders } from './auth';


// load profile from the server and send it to profile reducer through dispatch function
export const loadProfile = id => dispatch => {  // dispatch action
  dispatch({ type: PROFILE_LOADING });
  fetch(`/api/accounts/profile/${id}`).then(response => response.json()).then(data => dispatch({
    type: PROFILE_LOADED,
    payload: data
  })).catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
  })
};


// update profile
export const updateProfile = (id, profile, history) => (dispatch, getState) => {
  const formData = new FormData();
  // populate form object
  // formData.append('image', profile.imageFile, profile.imageFile.name);
  // formData.append('info', profile.info);
  // formData.append('username', profile.username);
  // formData.append('email', profile.email);
  // formData.append('first_name', profile.first_name);
  // formData.append('last_name', profile.last_name);
  // second argument "false" in composeHeaders function specifies that headers shouldn't
  // contain "{'Content-Type': 'application/json'}" key-value pair since posted data contains a file
  fetch(`api/accounts/profile/${id}/`, {method: 'PUT', body: formData, headers: composeHeaders(getState, false)})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(() => {
      // redirect to profile page after successful submission
      history.push(`${id}/`);
      dispatch(createMessage({postUpdated: 'Профиль был обновлен'}))
    }).catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
    })
};
