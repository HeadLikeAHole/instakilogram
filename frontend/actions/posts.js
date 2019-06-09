import { GET_POSTS, ADD_POST, DELETE_POST } from './types';
import { createMessage, returnErrors } from './messages';


// fetch posts from the server and send them to posts reducer through dispatch function
export const getPosts = () => dispatch => {  // dispatch action
  fetch('/api/posts/').then(response => response.json()).then(data => dispatch({
    type: GET_POSTS,
    payload: data
  })).catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
};


// add post to the server and send it to posts reducer through dispatch function
export const addPost = post => dispatch => {  // dispatch action
  fetch('/api/posts/', {method: 'POST', body: JSON.stringify(post), headers : {'Content-Type': 'application/json'}})
    .then(response => response.json()).then(data => {
      dispatch(createMessage({postAdded: 'Фото было добавлено'}));
      dispatch({
        type: ADD_POST,
        payload: data
      })
    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
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