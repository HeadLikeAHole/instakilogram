import {LOAD_POST_LIST, ADD_POST, DELETE_POST, LOGIN_FAIL} from './types';
import { createMessage, returnErrors } from './messages';
import { composeHeaders } from './auth';


// fetch posts from the server and send them to posts reducer through dispatch function
export const loadPostList = () => dispatch => {  // dispatch action
  fetch('/api/posts/').then(response => response.json()).then(data => dispatch({
    type: LOAD_POST_LIST,
    payload: data
  })).catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
};


// add post to the server and send it to posts reducer through dispatch function
export const addPost = (post, history) => (dispatch, getState) => {
  // display error if one of the fields is empty
  if (!post.imageFile && !post.description) {
    return dispatch(returnErrors('Добавьте фото и описание', 400));
  } else if (post.imageFile && !post.description) {
    return dispatch(returnErrors('Добавьте описание', 400));
  } else if (!post.imageFile && post.description) {
    return dispatch(returnErrors('Добавьте фото', 400));
  }

  const formData = new FormData();
  // populate form object
  formData.append('image', post.imageFile, post.imageFile.name);
  formData.append('description', post.description);
  // second argument "false" in composeHeaders function specifies that headers shouldn't
  // contain "'Content-Type': 'application/json'" key-value pair since posted data contains a file
  fetch('api/posts/', {method: 'POST', body: formData, headers: composeHeaders(getState, false)})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(data => {
      dispatch(createMessage({postAdded: 'Фото было добавлено'}));
      dispatch({
        type: ADD_POST,
        payload: data
      });
      // redirect to home page after successful post submission
      history.push('/')
    }).catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
    })
};


// update post
export const updatePost = (id, post, history) => (dispatch, getState) => {
  // display error if one of the fields is empty
  if (!post.description) {
    return dispatch(returnErrors('Добавьте описание', 400));
  }

  const formData = new FormData();
  // populate form object
  formData.append('image', post.imageFile, post.imageFile.name);
  formData.append('description', post.description);

  fetch(`api/posts/${id}/`, {method: 'PUT', body: formData, headers: composeHeaders(getState, false)})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(() => {
      dispatch(createMessage({postUpdated: 'Фото было обновленно'}));
      // redirect to home page after successful post submission
      history.push('/')
    }).catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
    })
};


// delete post from the server and send it to posts reducer through dispatch function
export const deletePost = id => (dispatch, getState) => {  // dispatch action
  fetch(`/api/posts/${id}/`, {method: 'DELETE', headers: composeHeaders(getState)})
    .then(() => {
      // create message after deleting post from the server
      dispatch(createMessage({postDeleted: 'Фото было удалено'}));
      dispatch({
        type: DELETE_POST,
        payload: id
      })
    }).catch(err => console.log(err))
};
