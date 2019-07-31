import { REPLY_INFO } from '../actions/types';


export default function (state = {}, action) {
  switch (action.type) {
    case REPLY_INFO:
      return action.payload;
    default:
      return state
  }
}
