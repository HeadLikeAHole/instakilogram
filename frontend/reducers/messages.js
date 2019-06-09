import { CREATE_MASSAGE } from '../actions/types';


export default function (state = {}, action) {
    switch (action.type) {
        case CREATE_MASSAGE:
            return state = action.payload;
        default:
            return state
    }
}