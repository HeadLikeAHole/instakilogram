import { LOAD_POST_LIST, ADD_POST, DELETE_POST } from './types';
import { createMessage, returnErrors } from './messages';


// fetch posts from the server and send them to posts reducer through dispatch function
export const loadPostList = () => dispatch => {  // dispatch action
  fetch('/api/posts/').then(response => response.json()).then(data => dispatch({
    type: LOAD_POST_LIST,
    payload: data
  })).catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
};


// add post to the server and send it to posts reducer through dispatch function
export const addPost = post => (dispatch, getState) => {
  // display error if one of the fields is empty
  if (!post.image && !post.description) {
    return dispatch(returnErrors('Добавьте фото и описание', 400));
  } else if (post.image && !post.description) {
    return dispatch(returnErrors('Добавьте описание', 400));
  } else if (!post.image && post.description) {
    return dispatch(returnErrors('Добавьте фото', 400));
  }

  const formData = new FormData();
  // populate form object
  formData.append('image', post.image, post.image.name);
  formData.append('description', post.description);
  const token = getState().auth.token;
  const headers = {};
  if (token) {
    headers['Authorization'] = `Token ${token}`
  }

  fetch('/api/posts/', {method: 'POST', body: formData, headers: headers})
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
      })
    }).catch(error => {
      const status = error.status;
      error.text().then(text => dispatch(returnErrors(text, status)))
    })
};


// delete post from the server and send it to posts reducer through dispatch function
export const deletePost = id => dispatch => {  // dispatch action
  fetch(`/api/posts/${id}/`, {method: 'DELETE', headers : {'Content-Type': 'application/json'}})
    .then(() => {
      // create message after deleting post from the server
      dispatch(createMessage({postDeleted: 'Фото было удалено'}));
      dispatch({
        type: DELETE_POST,
        payload: id
      })
    }).catch(err => console.log(err))
};
