import {
  COMMENT_LIST_LOADING,
  COMMENT_LIST_LOADED,
  COMMENT_LIST_MORE_LOADED,
  COMMENT_LIST_ERROR,
  REPLIES_LIST_LOADING,
  REPLIES_LIST_LOADED,
  REPLIES_LIST_ERROR,
  ADD_COMMENT,
  ADD_REPLY,
  UPDATE_COMMENT,
  UPDATE_REPLY,
  DELETE_COMMENT,
  DELETE_REPLY,
  REMOVE_COMMENT_FORM_INFO
} from './types';
import { createMessage, returnErrors } from './messages';
import { composeHeaders } from './auth';


// fetch comments from the server and send them to commentList reducer through dispatch function
export const loadCommentList = (post_id, next) => dispatch => {
  dispatch({type: COMMENT_LIST_LOADING});
  // if "next" url is passed to this function then load it otherwise just load /api/posts/${post_id}/comments/ url
  fetch(`${next ? next : `/api/posts/${post_id}/comments/`}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(data => {
      // if next load more comments if no next just load initial comments
      let type;
      if (next) {
        type = COMMENT_LIST_MORE_LOADED
      } else {
        type = COMMENT_LIST_LOADED
      }
      dispatch({type: type, payload: data})
    }).catch(error => {
      const status = error.status;
      error.json().then(msg => {
        dispatch(returnErrors(msg, status));
        dispatch({type: COMMENT_LIST_ERROR});
      });
    })
};


export const loadMoreReplies = (comment_id, pageNumber) => dispatch => {
  dispatch({type: REPLIES_LIST_LOADING});
  fetch(`/api/posts/comment/${comment_id}/?page=${pageNumber}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(data => dispatch({type: REPLIES_LIST_LOADED, payload: data}))
    .catch(error => {
      const status = error.status;
      error.json().then(msg => {
        dispatch(returnErrors(msg, status));
        dispatch({type: REPLIES_LIST_ERROR});
      });
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
  dispatch({type: REMOVE_COMMENT_FORM_INFO});
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
          type: UPDATE_REPLY,
          payload: data
        });
      } else {
        dispatch({
          type: UPDATE_COMMENT,
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


// like comment or reply
export const likeComment = (id, reply) => (dispatch, getState) => {
  fetch(`api/posts/comment/${id}/like/`, {headers: composeHeaders(getState)})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(comment => {
      if (reply) {
        dispatch({type: UPDATE_REPLY, payload: comment})
      } else {
        dispatch({type: UPDATE_COMMENT, payload: comment})
      }
    }).catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
    })
};
