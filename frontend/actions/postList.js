import {
  POST_LIST_LOADING,
  POST_LIST_LOADED,
  POST_LIST_MORE_LOADED,
  POST_LIST_ERROR,
  UPDATE_POST,
  UPDATE_POST_DETAIL,
  UPDATE_PROFILE_POSTS,
  DELETE_POST
} from './types';
import { createMessage, returnErrors } from './messages';
import { composeHeaders } from './auth';


// fetch posts from the server and send them to postList reducer through dispatch function
export const loadPostList = next => dispatch => {
  dispatch({ type: POST_LIST_LOADING });
  // if "next" url is passed to this function then load it otherwise just load '/api/posts/'
  fetch(`${next ? next : '/api/posts/'}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(data => {
      // if next load more posts if no next just load initial posts
      let type;
      if (next) {
        type = POST_LIST_MORE_LOADED
      } else {
        type = POST_LIST_LOADED
      }
      dispatch({type: type, payload: data})
    }).catch(error => {
      const status = error.status;
      error.json().then(msg => {
        dispatch(returnErrors(msg, status));
        dispatch({ type: POST_LIST_ERROR });
      });
    })
};


// add post to the server and redirect to home page
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
  // contain "{'Content-Type': 'application/json'}" key-value pair since posted data contains a file
  fetch('api/posts/', {method: 'POST', body: formData, headers: composeHeaders(getState, false)})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(() => {
      // redirect to home page after successful post submission
      history.push('/');
      dispatch(createMessage({postAdded: 'Фото было добавлено'}));
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
  // second argument "false" in composeHeaders function specifies that headers shouldn't
  // contain "{'Content-Type': 'application/json'}" key-value pair since posted data contains a file
  fetch(`api/posts/${id}/`, {method: 'PUT', body: formData, headers: composeHeaders(getState, false)})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(() => {
      // redirect to post detail after successful post submission
      history.push(`posts/${id}/`);
      dispatch(createMessage({postUpdated: 'Фото было обновленно'}))
    }).catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
    })
};


// delete post from the server and send it to posts reducer through dispatch function
export const deletePost = (id, arg) => (dispatch, getState) => {  // dispatch action
  fetch(`/api/posts/${id}/`, {method: 'DELETE', headers: composeHeaders(getState)})
    .then(() => {
      // if argument is toggleModal function then call it to close modal
      // otherwise use history object to redirect to home page
      if (typeof arg === "function") {
        // update user's post in profile page when post is deleted in post detail modal
        dispatch({
          type: UPDATE_PROFILE_POSTS,
          payload: id
        });
        arg();
      } else {
        arg.push('/');
      }
      // create message after deleting post from the server
      dispatch(createMessage({postDeleted: 'Фото было удалено'}));
      dispatch({
        type: DELETE_POST,
        payload: id
      })
    }).catch(err => console.log(err))
};


export const likePost = (id, postDetail) => (dispatch, getState) => {
  fetch(`api/posts/${id}/like/`, {headers: composeHeaders(getState)})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(post => {
      // if post is liked in home page (post list) then postDetail argument supplied to likePost function
      // should be set to false so UPDATE_POST action is dispatched
      // if post is liked in post detail page then postDetail argument supplied to likePost function
      // should be set to true so UPDATE_POST_DETAIL action is dispatched
      if (postDetail) {
        dispatch({type: UPDATE_POST_DETAIL, payload: post})
      } else {
        dispatch({type: UPDATE_POST, payload: post})
      }
    }).catch(error => {
      const status = error.status;
      error.json().then(msg => dispatch(returnErrors(msg, status)));
    })
};
