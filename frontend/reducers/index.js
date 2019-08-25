import { combineReducers } from 'redux';

import auth from './auth';
import postList from './postList';
import postDetail from './postDetail';
import commentList from './commentList';
import commentFormInfo from './commentFormInfo';
import profile from './profile';
import errors from './errors';
import messages from './messages';
import modal from './modal';
import postSlider from './postSlider';
import userList from './userList';


export default combineReducers({
  auth,
  postList,
  postDetail,
  commentList,
  commentFormInfo,
  profile,
  errors,
  messages,
  modal,
  postSlider,
  userList
})
