import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import { loadProfile } from '../../actions/profile';
import { postsToDisplay } from '../../actions/postSlider';
import './profile.css';
import PostGrid from '../posts/PostGrid';
import PostDetailModal from '../posts/PostDetailModal';


class Profile extends React.Component {
  state = {
    userPosts: true, activeLink: true
  };

  // select between user's post and user's saved posts
  selectLink = link => {
    if (link === 'posts') {
      this.setState({userPosts: true, activeLink: true})
    } else {
      this.setState({userPosts: false, activeLink: false})
    }
  };

  componentDidMount() {
    this.props.loadProfile(this.props.match.params.id);
  }

  render() {
    const { authUser, profile } = this.props;

    // check if current logged in user is profile's owner
    let authorized = false;
    if (authUser && profile.user) {
      if (authUser.id === profile.user.id) {
        authorized = true
      }
    }

    // check which posts to display, user posts or saved posts
    let selectedPosts;
    if (this.state.userPosts) {
      if (profile.user_posts) {
        selectedPosts = profile.user_posts
      }
    } else {
      if (profile.user_saved_posts) {
        selectedPosts = profile.user_saved_posts
      }
    }
    this.props.postsToDisplay(selectedPosts);

    return (
      <React.Fragment>
        <Row noGutters={true} className="mx-2 my-3 my-sm-5">
          <Col sm={4}><Image src={profile.image} roundedCircle className="d-block mx-auto mb-2 w-50" /></Col>
          <Col sm={8}>
            <Row className="mb-3 justify-content-around justify-content-sm-start">
              <span className="font-italic mr-2 p-p-username">{profile.user && profile.user.username}</span>
              {authorized ?
                <Link to="/profile/edit"><Button variant="light" className="font-weight-bold">Edit Profile</Button></Link> :
                <Button variant="light" className="font-weight-bold">Follow</Button>}
            </Row>
            <Row className="mb-3 justify-content-around justify-content-sm-start">
              <span className="mr-5"><span className="font-weight-bold">{profile.user_posts && profile.user_posts.length}</span> posts</span>
              <span className="mr-5"><span className="font-weight-bold">{profile.followers && profile.followers.length}</span> followers</span>
              <span><span className="font-weight-bold">{profile.following && profile.following.length}</span> following</span>
            </Row>
            <Row className="mb-1 font-weight-bold">{profile.user && profile.user.first_name} {profile.user && profile.user.last_name}</Row>
            <Row>{profile.info}</Row>
          </Col>
        </Row>
        <hr className="mb-0" />
        <Row className="mb-3 text-uppercase justify-content-center p-p-links">
          <span className={`mr-5 py-2 ${this.state.activeLink && 'active-link'}`} onClick={() => this.selectLink('posts')}>posts</span>
          {authorized && <span className={`py-2 ${this.state.activeLink || 'active-link'}`} onClick={() => this.selectLink('saved')}>saved</span>}
        </Row>
        {/* user posts or saved posts */}
        {selectedPosts && <PostGrid />}
        {this.props.modalOpen && <PostDetailModal />}
      </React.Fragment>
    )
  }
}


Profile.propTypes = {
  authUser: PropTypes.object,
  profile: PropTypes.object.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  loadProfile: PropTypes.func.isRequired,
  postsToDisplay: PropTypes.func.isRequired
};


// make state available to Profile component though props
const mapStateToProps = state => ({
  authUser: state.auth.user,
  profile: state.profile,
  modalOpen: state.modal.modalOpen
});


export default connect(mapStateToProps, { loadProfile, postsToDisplay })(Profile);
