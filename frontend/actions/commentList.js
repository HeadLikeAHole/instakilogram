import {LOAD_COMMENT_LIST, ADD_COMMENT, ADD_REPLY, EDIT_COMMENT, EDIT_REPLY, DELETE_COMMENT, DELETE_REPLY} from './types';
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
        payload: data
      });
      // reset state after successful reply submission
      addReplyInfo({})
    }).catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
    })
};


// edit comment or reply
export const editComment = (text, comment_id, parent_id) => (dispatch, getState) => {
  const body = JSON.stringify({ text });

  fetch(`api/posts/comment/${comment_id}/`, {method: 'PUT', body: body, headers: composeHeaders(getState)})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(data => {
      dispatch(createMessage({commentAdded: 'Комментарий был обновлен'}));
      // if there is parent_id then reply is edited otherwise comment
      if (parent_id) {
        dispatch({
          type: EDIT_REPLY,
          payload: data
        });
      } else {
        dispatch({
          type: EDIT_COMMENT,
          payload: data
        });
      }
    }).catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
    })
};


// delete comment or reply
export const deleteComment = (comment_id, parent_id) => (dispatch, getState) => {  // dispatch action
  fetch(`api/posts/comment/${comment_id}/`, {method: 'DELETE', headers: composeHeaders(getState)})
    .then(() => {
      // create message after deleting comment from the server
      dispatch(createMessage({postDeleted: 'Комментарий был удален'}));
      // if there is parent_id then reply is edited otherwise comment
      if (parent_id) {
        dispatch({
          type: DELETE_REPLY,
          payload: {comment_id, parent_id}
        });
      } else {
        dispatch({
          type: DELETE_COMMENT,
          payload: comment_id
        });
      }
    }).catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
    })
};

