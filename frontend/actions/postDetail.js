import { LOAD_POST_DETAIL} from './types';
import { returnErrors } from './messages';


// load post detail from the server and send it to post detail reducer through dispatch function
export const loadPostDetail = id => dispatch => {  // dispatch action
  if (id) {
    fetch(`/api/posts/${id}/`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
         throw response;
        }
      })
      .then(data => dispatch({type: LOAD_POST_DETAIL, payload: data}))
      .catch(error => {
        const status = error.status;
        error.json().then(msg => dispatch(returnErrors(msg, status)));
    })
  } else {
    // if no id supplied remove state
    dispatch({ type: LOAD_POST_DETAIL, payload: {} })
  }
};
