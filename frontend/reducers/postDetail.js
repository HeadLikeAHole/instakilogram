import { LOAD_POST_DETAIL, UPDATE_POST_DETAIL, POST_DETAIL_COMMENT_COUNT_ADD, POST_DETAIL_COMMENT_COUNT_SUBTRACT } from '../actions/types';


export default function (state = {}, action) {
  switch (action.type) {
    case LOAD_POST_DETAIL:
    case UPDATE_POST_DETAIL:
      return action.payload;
    case POST_DETAIL_COMMENT_COUNT_ADD:
      return {...state, comments_count: state.comments_count + 1};
    case POST_DETAIL_COMMENT_COUNT_SUBTRACT:
      return {...state, comments_count: state.comments_count -1};
    default:
      return state
  }
}
