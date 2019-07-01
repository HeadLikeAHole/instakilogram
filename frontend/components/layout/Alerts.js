import React from 'react';
import { withAlert } from 'react-alert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'


// just display an error message without rendering anything
class Alerts extends React.Component {
  static propTypes = {
    error: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error, alert, message } = this.props;

    if (error !== prevProps.error) {
      // check for a field error and then join an array of this field errors
      if (error.msg.image) alert.error(`Image: ${error.msg.image.join()}`);
      if (error.msg.description) alert.error(`Description: ${error.msg.description.join()}`);
      if (error.msg.non_field_errors) alert.error(error.msg.non_field_errors.join());
      if (error.msg.username) alert.error(error.msg.username.join());
      if (error.msg.password) alert.error(error.msg.password.join());
      if (error.msg) alert.error(error.msg);
    }

    if (message !== prevProps.message) {
      if (message.postAdded) alert.success(message.postAdded);
      if (message.postUpdated) alert.success(message.postUpdated);
      if (message.postDeleted) alert.success(message.postDeleted);
      if (message.passwordsNotMatch) alert.error(message.passwordsNotMatch);
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
