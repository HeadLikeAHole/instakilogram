import { REPLY_INFO } from './types';


export const addReplyInfo = info => (
  {
    type: REPLY_INFO,
    payload: info
  }
);
