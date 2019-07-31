import { LOAD_COMMENT_LIST, ADD_COMMENT, ADD_REPLY } from './types';
import { createMessage, returnErrors } from './messages';
import { composeHeaders } from './auth';


// fetch comments from the server and send them to commentList reducer through dispatch function
export const loadCommentList = post_id => dispatch => {  // dispatch action
  fetch(`/api/posts/${post_id}/comments/`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(data => dispatch({
      type: LOAD_COMMENT_LIST,
      payload: data
    })
    ).catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
    })
};


export const addComment = (text, post_id) => (dispatch, getState) => {
  const body = JSON.stringify({ text });

  fetch(`api/posts/${post_id}/comments/`, {method: 'POST', body: body, headers: composeHeaders(getState)})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(data => {
      dispatch(createMessage({commentAdded: 'Комментарий был добавлен'}));
      dispatch({
        type: ADD_COMMENT,
        payload: data
      });
    }).catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
    })
};


export const addReply = (text, post_id, parent_id, addReplyInfo) => (dispatch, getState) => {
  const body = JSON.stringify({ text });

  fetch(`api/posts/${post_id}/comments/${parent_id}/replies/`, {method: 'POST', body: body, headers: composeHeaders(getState)})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(data => {
      dispatch(createMessage({commentAdded: 'Комментарий был добавлен'}));
      dispatch({
        type: ADD_REPLY,
        payload: {parent_id, data}
      });
      // reset state after successful reply submission
      addReplyInfo({comment_id: '', username: '', parent_id: ''})
    }).catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
    })
};
