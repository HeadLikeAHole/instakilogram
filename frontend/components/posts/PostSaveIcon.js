import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';

import { savePost } from '../../actions/auth';


class PostSaveIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    }
  }

  static propTypes = {
    savePost: PropTypes.func.isRequired,
    authUser: PropTypes.object.isRequired,
    post_id: PropTypes.number.isRequired
  };

  handleSave = () => {
    const { authUser, post_id } = this.props;
    if (authUser.isAuthenticated) {
      this.props.savePost(authUser.user.id, post_id)
    } else {
      this.setState({ redirect: true })
    }
  };

  render() {
    const { authUser, post_id } = this.props;

    let isSaved = false;
    if (authUser && Object.keys(authUser.user).length > 0) {
      if (authUser.user.saved_posts.includes(post_id)) {
        isSaved = true;
      }
    }

    return (
      <React.Fragment>
        {/* if user is not authenticated on bookmark icon click he is redirected to login page*/}
        {!this.state.redirect ?
          // if post has been saved then bookmark icon turns solid if clicked again it turns back to outlined gray
          <i className={`${isSaved ? 'fas saved' : 'far'} fa-bookmark my-icon`} onClick={this.handleSave}></i> :
          <Redirect to="/login" />}
      </React.Fragment>
    )
  }
}


const mapStateToProps = state => ({
  authUser: state.auth
});


export default connect(mapStateToProps, { savePost })(PostSaveIcon);
