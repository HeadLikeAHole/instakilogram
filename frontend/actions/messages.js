import { CREATE_MASSAGE, GET_ERRORS } from './types';


export const createMessage = msg => (
    {
        type: CREATE_MASSAGE,
        payload: msg
    }
);


export const returnErrors = (msg, status) => {
  return {
    type: GET_ERRORS,
    payload: {msg, status}
  }
};
