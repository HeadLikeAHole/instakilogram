import { combineReducers } from 'redux';

import postList from './postList';
import postDetail from './postDetail';
import errors from './errors';
import messages from './messages';
import auth from './auth';


export default combineReducers({
  postList,
  postDetail,
  errors,
  messages,
  auth,
})
