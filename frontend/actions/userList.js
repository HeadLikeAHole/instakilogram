import { USER_LIST_LOADING, USER_LIST_LOADED, USER_LIST_ERROR, REMOVE_USER_LIST } from './types';
import { returnErrors } from './messages';


export const loadUserList = (title, id, next) => dispatch => {
  dispatch({type: USER_LIST_LOADING});
  // select necessary url for api call
  let url;
  switch (title) {
    case 'Подписчики:':
      url = `api/accounts/profile/${id}/followers/`;
      break;
    case 'Подписки:':
      url = `api/accounts/profile/${id}/following/`;
      break;
    case 'Публикацию лайкнули:':
      url = `api/posts/${id}/like-list/`;
      break;
    case 'Комментарий лайкнули:':
      url = `api/posts/comment/${id}/like-list/`;
      break;
  }
  // if "next" url is passed to this function then load it otherwise just load /api/posts/${post_id}/comments/ url
  console.log(url);
  fetch(`${next ? next : url}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       throw response;
      }
    })
    .then(data => dispatch({type: USER_LIST_LOADED, payload: data}))
    .catch(error => {
      const status = error.status;
      error.json().then(msg => {
        dispatch(returnErrors(msg, status));
        dispatch({type: USER_LIST_ERROR});
      });
    })
};


export const removeUserList = () => (
  {
    type: REMOVE_USER_LIST
  }
);
