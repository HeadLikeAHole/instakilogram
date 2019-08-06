import { CURRENT_POST_ID, POSTS_TO_DISPLAY } from './types';


// id of the post currently displayed by post slider
export const currentPostId = id => (
  {
    type: CURRENT_POST_ID,
    payload: id
  }
);

// user posts or saved user posts are in the payload
export const postsToDisplay = posts => (
  {
    type: POSTS_TO_DISPLAY,
    payload: posts
  }
);
