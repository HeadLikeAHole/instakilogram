import React from 'react';
import { withAlert } from 'react-alert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { translate } from '../../helperFunctions';


// just display an error message without rendering anything
class Alerts extends React.Component {
  static propTypes = {
    error: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired
  };

  componentDidUpdate(prevProps) {
    const { alert, error, message } = this.props;

    if (error !== prevProps.error) {
      if (error.msg.username) alert.error(`логин: ${translate(error.msg.username).join(' --- ')}`);
      if (error.msg.email) alert.error(`email: ${translate(error.msg.email).join(' --- ')}`);
      if (error.msg.password) alert.error(`пароль: ${translate(error.msg.password).join(' --- ')}`);
      if (error.msg.non_field_errors) alert.error(translate(error.msg.non_field_errors).join(' --- '));
    }

    if (message !== prevProps.message) {
      if (message.postAdded) alert.success(message.postAdded);
      if (message.postUpdated) alert.success(message.postUpdated);
      if (message.postDeleted) alert.success(message.postDeleted);
      if (message.passwordsNotMatch) alert.error(message.passwordsNotMatch);
      if (message.commentAdded) alert.success(message.commentAdded);
      if (message.passwordChanged) alert.success(message.passwordChanged);
      if (message.passwordReset) alert.success(message.passwordReset);
      if (message.profileUpdated) alert.success(message.profileUpdated);
      if (message.profileDeleted) alert.success(message.profileDeleted);
      if (message.register) alert.success(message.register);
      if (message.logout) alert.success(message.logout);
    }
  }

  render() {
    return <React.Fragment />
  }
}


// make state available to Alerts component though props
const mapStateToProps = state => ({
  error: state.errors,
  message: state.messages
});


export default connect(mapStateToProps)(withAlert()(Alerts));
