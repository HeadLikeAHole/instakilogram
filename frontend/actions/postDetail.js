import {LOAD_POST_DETAIL, UPDATE_POST} from './types';
import { returnErrors } from './messages';
import {composeHeaders} from "./auth";


// load post detail from the server and send it to post detail reducer through dispatch function
export const loadPostDetail = id => dispatch => {  // dispatch action
  if (id) {
    fetch(`/api/posts/${id}/`).then(response => response.json()).then(data => dispatch({
      type: LOAD_POST_DETAIL,
      payload: data
    })).catch(error => {
        const status = error.status;
        error.json().then(msg => dispatch(returnErrors(msg, status)));
    })
  } else {
    // if no id supplied remove state
    dispatch({
      type: LOAD_POST_DETAIL,
      payload: {}
    })
  }
};
