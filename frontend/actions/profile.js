import { LOAD_PROFILE, USER_UPDATE, DELETE_PROFILE_SUCCESS, REMOVE_PROFILE, PASSWORD_CHANGE_SUCCESS } from './types';
import { createMessage, returnErrors } from './messages';
import { composeHeaders } from './auth';


// load profile from the server and send it to profile reducer through dispatch function
export const loadProfile = (id, prefillForm) => dispatch => {  // dispatch action
  fetch(`/api/accounts/profile/${id}`)
    .then(response => response.json())
    .then(data => {
      dispatch({type: LOAD_PROFILE, payload: data});
      // prefillForm function is passed down from profile edit component to prefill form fields
      if (prefillForm) prefillForm(data)
    }).catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
  })
};


// update profile (chaining two fetch calls to user and profile APIs)
export const updateProfile = (id, profile, history) => (dispatch, getState) => {
  const userData = JSON.stringify({
        'username': profile.username,
        'email': profile.email,
        'first_name': profile.first_name,
        'last_name': profile.last_name
      });

  const profileData = new FormData();
  profileData.append('image', profile.imageFile, profile.imageFile.name);
  profileData.append('info', profile.info);

  let payload;
  fetch(`api/accounts/user/`, {method: 'PUT', body: userData, headers: composeHeaders(getState)})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(data => payload = data)
    // second argument "false" in composeHeaders function specifies that headers shouldn't
    // contain "{'Content-Type': 'application/json'}" key-value pair since posted data contains a file
    .then(() => fetch(`api/accounts/profile/${id}/`, {method: 'PUT', body: profileData, headers: composeHeaders(getState, false)}))
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(data => {
      payload = {...payload, profile_image: data.image};
      dispatch({type: USER_UPDATE, payload: payload});
      // redirect to profile page after successful submission
      history.push(`${id}/`);
      dispatch(createMessage({profileUpdated: 'Профиль был обновлен'}))
    }).catch(error => console.log(error))
};


export const deleteProfile = history => (dispatch, getState) => {
  fetch(`api/accounts/user/`, {method: 'DELETE', headers: composeHeaders(getState)})
    .then(() => {
      history.push('/');
      dispatch(createMessage({profileDeleted: 'Профиль был удален'}));
      dispatch({ type: DELETE_PROFILE_SUCCESS })
    })
};


export const changePassword = (oldPassword, newPassword, toggleModal) => (dispatch, getState) => {
  const body = JSON.stringify({ old_password: oldPassword, new_password: newPassword });

  fetch('api/accounts/user/change-password/', {method: 'PUT', body: body, headers: composeHeaders(getState)})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then(data => {
      dispatch({
        type: PASSWORD_CHANGE_SUCCESS,
        payload: data
      });
      dispatch(createMessage({passwordChanged: 'Пароль был изменен'}));
      toggleModal();
    }).catch(error => {
      dispatch(returnErrors(error.statusText, error.status));
  })
};


// remove profile from the redux store so when navigating from profile to profile
// previous profile isn't visible momentarily in current profile while it's loading
export const removeProfile = () => (
  {
    type: REMOVE_PROFILE
  }
);
