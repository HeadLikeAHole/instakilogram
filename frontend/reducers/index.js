import { combineReducers } from 'redux';

import auth from './auth';
import postList from './postList';
import postDetail from './postDetail';
import profile from './profile';
import errors from './errors';
import messages from './messages';
import modal from './modal';
import postSlider from './postSlider';


export default combineReducers({
  auth,
  postList,
  postDetail,
  profile,
  errors,
  messages,
  modal,
  postSlider
})
