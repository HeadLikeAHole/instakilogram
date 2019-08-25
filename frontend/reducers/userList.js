import { USER_LIST_LOADING, USER_LIST_LOADED, USER_LIST_ERROR, REMOVE_USER_LIST } from '../actions/types';


const initialState = {
  isLoading: false,
  count: null,
  next: null,
  previous: null,
  users: []
};


export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LIST_LOADING:
      return {...state, isLoading: true};
    case USER_LIST_LOADED:
      return {
        isLoading: false,
        count: action.payload.count,
        next: action.payload.next,
        previous: action.payload.previous,
        users: [...state.users, ...action.payload.users]
      };
    case USER_LIST_ERROR:
      return {...state, isLoading: false};
    case REMOVE_USER_LIST:
      return initialState;
    default:
      return state
  }
}
