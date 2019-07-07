import { TOGGLE_MODAL } from '../actions/types';


export default function (state = {modalOpen: false}, action) {
  switch (action.type) {
    case TOGGLE_MODAL:
      return {...state, modalOpen: !state.modalOpen};
    default:
      return state
  }
}
