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
import { pluralize } from '../../helperFunctions';
import UserListModal from '../common/UserListModal';
import { removeUserList } from '../../actions/userList';
import FollowButton from '../common/FollowButton';


class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      savedPosts: '',
      showUserListModal: false,
      title: ''
    };
  }

  static propTypes = {
    authUser: PropTypes.object,
    profile: PropTypes.object.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    loadProfile: PropTypes.func.isRequired,
    postsToDisplay: PropTypes.func.isRequired,
    removeUserList: PropTypes.func.isRequired
  };

  toggleModal = title => this.setState({showUserListModal: !this.state.showUserListModal, title});

  // select between user's post and user's saved posts
  selectLink = link => {
    if (link === 'posts') {
      localStorage.removeItem('savedPosts');
      this.setState({savedPosts: localStorage.getItem('savedPosts')})
    } else {
      localStorage.setItem('savedPosts', 'true');
      this.setState({savedPosts: localStorage.getItem('savedPosts')})
    }
  };

  // localStorage is used for "сохранено" link persistence on page refresh
  componentDidMount() {
    this.props.loadProfile(this.props.match.params.id);
    this.setState({savedPosts: localStorage.getItem('savedPosts')})
  }

  componentWillUnmount() {
    localStorage.removeItem('savedPosts');
    this.props.removeUserList();
  }

  render() {
    const { authUser, profile } = this.props;

    // check if current logged in user is profile's owner
    let authorized = false;
    let page = '';
    if (authUser && profile.user) {
      if (authUser.id === profile.user.id) {
        authorized = true;
        page = 'own';
      }
    }

    // check if followers has loaded so they can be passed as props
    let followButton;
    if (Object.keys(profile).length > 0) {
      followButton = <FollowButton profile_id={profile.id} page='profile' />
    }

    // check which posts to display, user posts or saved posts
    let selectedPosts;
    if (!this.state.savedPosts) {
      if (profile.user_posts) {
        selectedPosts = profile.user_posts
      }
    } else {
      if (profile.saved_posts) {
        selectedPosts = profile.saved_posts
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
                <Link to="/profile/edit"><Button variant="light" className="font-weight-bold">Редактировать Профиль</Button></Link> :
                followButton}
            </Row>
            <Row className="mb-3 justify-content-around justify-content-sm-start">
              <span className="mr-5"><span className="font-weight-bold">{profile.user_posts && profile.user_posts.length}</span> posts</span>
              {/* "подписчики" are "followers" */}
              <span className="mr-5 cursor-pointer" onClick={() => this.toggleModal('подписчики')}><span className="font-weight-bold">{profile.id && profile.followers_count}</span> {pluralize('follower', profile.followers_count)}</span>
              <span className="cursor-pointer" onClick={() => this.toggleModal('подписки')}><span className="font-weight-bold">{profile.id && profile.following_count}</span> {pluralize('following', profile.following_count)}</span>
            </Row>
            <Row className="mb-1 font-weight-bold">{profile.user && profile.user.first_name} {profile.user && profile.user.last_name}</Row>
            <Row>{profile.info}</Row>
          </Col>
        </Row>
        <hr className="mb-0" />
        <Row className="mb-3 text-uppercase justify-content-center p-p-links">
          {/* if userPosts is true then "публикации" link has css class "active-link" and therefore is underlined otherwise
          "сохранено" link has css class "active-link" and is underlined */}
          <span className={`mr-5 py-2 ${this.state.savedPosts || 'active-link'}`} onClick={() => this.selectLink('posts')}>публикации</span>
          {authorized && <span className={`py-2 ${this.state.savedPosts && 'active-link'}`} onClick={() => this.selectLink('saved')}>сохранено</span>}
        </Row>
        {/* user posts or saved posts */}
        {selectedPosts && <PostGrid />}
        {this.props.modalOpen && <PostDetailModal />}
        {this.props.profile.id &&
          <UserListModal
            show={this.state.showUserListModal}
            title={this.state.title}
            toggleModal={this.toggleModal}
            id={profile.id}
            page={page}
          />
        }
      </React.Fragment>
    )
  }
}


// make state available to Profile component though props
const mapStateToProps = state => ({
  authUser: state.auth.user,
  profile: state.profile,
  modalOpen: state.modal.modalOpen
});


export default connect(mapStateToProps, { loadProfile, postsToDisplay, removeUserList })(Profile);
