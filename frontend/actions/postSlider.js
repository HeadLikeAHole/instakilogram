import {
  CURRENT_POST_ID,
  POST_SLIDER_LOADING,
  POST_SLIDER_LOADED,
  POST_SLIDER_MORE_LOADED,
  POST_SLIDER_ERROR,
  REMOVE_POST_SLIDER
} from './types';
import { returnErrors } from './messages';


// id of the post currently displayed by post slider
export const currentPostId = id => (
  {
    type: CURRENT_POST_ID,
    payload: id
  }
);

// user posts or saved user posts are in the payload
export const loadPostSlider = (user_id, saved_posts, next) => dispatch => {
  dispatch({type: POST_SLIDER_LOADING});
  // if "next" url is passed to this function then load it otherwise just load /api/posts/${post_id}/comments/ url
  fetch(`${next ? next : `/api/posts/post-slider/?user_id=${user_id}&saved_posts=${saved_posts}`}`)
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
        type = POST_SLIDER_MORE_LOADED
      } else {
        type = POST_SLIDER_LOADED
      }
      dispatch({type: type, payload: data})
    }).catch(error => {
      const status = error.status;
      error.json().then(msg => {
        dispatch(returnErrors(msg, status));
        dispatch({type: POST_SLIDER_ERROR});
      });
    })
};


export const removePostSlider = () => (
  {
    type: REMOVE_POST_SLIDER
  }
);
