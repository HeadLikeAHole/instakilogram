import {
  POST_LIST_LOADING,
  POST_LIST_LOADED,
  POST_LIST_MORE_LOADED,
  POST_LIST_ERROR,
  REMOVE_POST_LIST,
  UPDATE_POST,
  UPDATE_POST_DETAIL,
  DELETE_SLIDER_POST,
  DELETE_POST
} from './types';
import { createMessage, returnErrors } from './messages';
import { composeHeaders } from './auth';


// fetch current logged in user's posts and posts by users this user follows
export const loadPostListFeed = next => (dispatch, getState) => {
  dispatch({ type: POST_LIST_LOADING });
  // if "next" url is passed to this function then load it otherwise just load '/api/posts/'
  // composeHeaders function returns token and content type
  fetch(`${next ? next : '/api/posts/'}`, {headers: composeHeaders(getState)})
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(data => {
      // if next then load more posts if no next just load initial posts
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


// loadPostListAll fetches all posts in the database
export const loadPostListAll = next => dispatch => {
  dispatch({ type: POST_LIST_LOADING });
  // if "next" url is passed to this function then load it otherwise just load '/api/posts/all/'
  fetch(`${next ? next : '/api/posts/all/'}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(data => {
      // if next then load more posts if no next just load initial posts
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


// loadAllPosts fetches all posts in the database or posts satisfying a search query
export const loadPostListSearch = (next, query, history) => dispatch => {
  dispatch({ type: POST_LIST_LOADING });
  // if "next" url is passed to this function then load it otherwise just load '/api/posts/search/?query='
  fetch(`${next ? `${next}&${query}` : `/api/posts/search/?query=${query}`}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(data => {
      // on successful search submission redirect to search page
      if (history) {
        history.push(`/search?query=${query}`)
      }
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


// remove post list from the redux store so when navigating from feed to all posts or back
// previous post list doesn't get merged with current one
export const removePostList = () => (
  {
    type: REMOVE_POST_LIST
  }
);


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
          type: DELETE_SLIDER_POST,
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
    }).catch(error => console.log(error))
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
