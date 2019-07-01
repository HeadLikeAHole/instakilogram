import React from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { loadProfile } from '../../actions/profile';

import './profile.css';
import PostGrid from '../posts/PostGrid';


class Profile extends React.Component {
  state = {
    userPosts: true
  };

  componentDidMount() {
    this.props.loadProfile(this.props.match.params.id)
  }

  render() {
    const { authUser, profile } = this.props;

    let authorized = false;

    // check if current logged in user is profile's owner
    if (authUser && profile.user) {
      if (authUser.id === profile.user.id) {
        authorized = true
      }
    }

    let postsToDisplay;
    // check which posts to display, user posts or saved posts
    if (this.state.userPosts) {
      if (profile.user_posts) {
        postsToDisplay = profile.user_posts
      } else {
        if (profile.saved_posts) {
          postsToDisplay = profile.saved_posts
        }
      }
    }

    return (
      <React.Fragment>
        <Row className="my-5">
          <Col><Image src={profile.image} roundedCircle className="d-block mx-auto w-50" /></Col>
          <Col xs={8}>
            <Row className="mb-3">
              <span className="font-italic mr-2 p-p-username">{profile.user && profile.user.username}</span>
              {authorized ?
                <Button variant="light" className="font-weight-bold">Edit Profile</Button> :
                <Button variant="light" className="font-weight-bold">Follow</Button>}

            </Row>
            <Row className="mb-3">
              <span className="mr-5"><span className="font-weight-bold">{profile.user_posts && profile.user_posts.length}</span> posts</span>
              <span className="mr-5"><span className="font-weight-bold">{profile.followers && profile.followers.length}</span> followers</span>
              <span><span className="font-weight-bold">{profile.following && profile.following.length}</span> following</span>
            </Row>
            <Row className="mb-1 font-weight-bold">{profile.user && profile.user.first_name} {profile.user && profile.user.last_name}</Row>
            <Row>{profile.info}</Row>
          </Col>
        </Row>
        <hr className="m-0" />
        <Row className="text-uppercase justify-content-center p-p-links">
          <span className="mr-5 py-2 selected-link">posts</span>
          {authorized && <span className="py-2">saved</span>}
        </Row>
        {/*<PostGrid posts={postsToDisplay}/>*/}
      </React.Fragment>
    )
  }
}


Profile.propTypes = {
  authUser: PropTypes.object,
  profile: PropTypes.object.isRequired
};


// make state available to Profile component though props
const mapStateToProps = state => ({
  authUser: state.auth.user,
  profile: state.profile
});


export default connect(mapStateToProps, { loadProfile })(Profile);
