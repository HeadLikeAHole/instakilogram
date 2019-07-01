import { combineReducers } from 'redux';

import auth from './auth';
import postList from './postList';
import postDetail from './postDetail';
import profile from './profile';
import errors from './errors';
import messages from './messages';


export default combineReducers({
  auth,
  postList,
  postDetail,
  profile,
  errors,
  messages,
})
