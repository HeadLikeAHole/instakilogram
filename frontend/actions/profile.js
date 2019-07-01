import { LOAD_PROFILE } from './types';
import { returnErrors } from './messages';


// load profile from the server and send it to profile reducer through dispatch function
export const loadProfile = id => dispatch => {  // dispatch action
  fetch(`/api/accounts/profile/${id}`).then(response => response.json()).then(data => dispatch({
    type: LOAD_PROFILE,
    payload: data
  })).catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
  })
};
