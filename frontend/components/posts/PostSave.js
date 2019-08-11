import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';

import { savePost } from '../../actions/auth';


class PostSave extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    }
  }

  static propTypes = {
    savePost: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    profile_id: PropTypes.number.isRequired,
    post_id: PropTypes.number.isRequired,
    isSaved: PropTypes.bool.isRequired,
  };

  handleSave = () => {
    const { isAuthenticated, profile_id, post_id } = this.props;
    if (isAuthenticated) {
      this.props.savePost(profile_id, post_id)
    } else {
      this.setState({ redirect: true })
    }
  };

  render() {
    return (
      <React.Fragment>
        {/* if user is not authenticated on bookmark icon click he is redirected to login page*/}
        {!this.state.redirect ?
          // if post has been saved then bookmark icon turns solid if clicked again it turns back to outlined gray
          <i className={`${this.props.isSaved ? 'fas saved' : 'far'} fa-bookmark my-icon`} onClick={this.handleSave}></i> :
          <Redirect to="/login" />}
      </React.Fragment>
    )
  }
}


const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});


export default connect(mapStateToProps, { savePost })(PostSave);
