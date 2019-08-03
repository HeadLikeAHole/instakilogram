import { ADD_COMMENT_FORM_INFO } from './types';


export const addCommentFormInfo = info => (
  {
    type: ADD_COMMENT_FORM_INFO,
    payload: info
  }
);
