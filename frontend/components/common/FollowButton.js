import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';

import { follow } from '../../actions/auth';


class FollowButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    }
  }

  static propTypes = {
    follow: PropTypes.func.isRequired,
    authUser: PropTypes.object.isRequired,
    profile_id: PropTypes.number.isRequired,
    page: PropTypes.string
  };

  handleFollow = () => {
    const { authUser, profile_id, page } = this.props;
    if (authUser.isAuthenticated) {
      this.props.follow(authUser.user.id, profile_id, page)
    } else {
      this.setState({ redirect: true })
    }
  };

  render() {
    const { authUser, profile_id } = this.props;

    let isFollowing = false;
    let ownProfile = false;
    // wait for user object to load
    if (Object.keys(authUser.user).length) {
      // check if user follows profile
      if (authUser.user.following.includes(profile_id)) {
        isFollowing = true;
      }
      // check if it's user's profile
      if (authUser.user.id === profile_id) {
        ownProfile = true;
      }
    }

    const followButton = ownProfile || (
      <Button variant={isFollowing ? 'dark' : 'light'} className="font-weight-bold" onClick={this.handleFollow}>
        {isFollowing ? 'Отписаться' : 'Подписаться'}
      </Button>
    );

    return (
      <React.Fragment>
        {!this.state.redirect ? followButton : <Redirect push to="/login" />}
      </React.Fragment>
    )
  }
}


const mapStateToProps = state => ({
  authUser: state.auth
});


export default connect(mapStateToProps, { follow })(FollowButton);
