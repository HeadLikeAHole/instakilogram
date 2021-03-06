import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import './profile.css';
import PostGrid from '../posts/PostGrid';
import PostDetailModal from '../posts/PostDetailModal';
import UserListModal from '../common/UserListModal';
import FollowButton from '../common/FollowButton';
import LogoutIcon from './LogoutIcon';
import ProfileImage from '../common/ProfileImage';
import { loadProfile } from '../../actions/profile';
import { removeProfile } from '../../actions/profile';
import { removeUserList } from '../../actions/userList';
import { pluralize } from '../../helperFunctions';


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
    removeProfile: PropTypes.func.isRequired,
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

  // reload profile when navigating from someone's profile to own profile
  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.props.loadProfile(this.props.match.params.id);
    }
  }

  componentWillUnmount() {
    localStorage.removeItem('savedPosts');
    // removeProfile function removes profile object from the redux store
    this.props.removeProfile();
    // remove userList object from the redux store so when user goes to another page without closing user list modal
    // in profile page and clicks on another user list modal old list isn't displayed
    this.props.removeUserList();
  }

  render() {
    const { authUser, profile } = this.props;

    // check if profile has loaded
    let profileLoaded = false;
    if (Object.keys(this.props.profile).length) {
      profileLoaded = true
    }

    // check if current logged in user is profile's owner
    let authorized = false;
    let page = '';
    if (Object.keys(this.props.authUser).length && profileLoaded) {
      if (authUser.id === profile.user.id) {
        authorized = true;
        page = 'own';
      }
    }

    const followButton = <FollowButton profile_id={parseInt(this.props.match.params.id, 10)} page='profile' />;

    return (
      <React.Fragment>
        <Row noGutters={true} className="mx-2 my-3 my-sm-5">
          <Col sm={3}><ProfileImage src={profile.image} className="mx-auto mb-2 w-75" /></Col>
          <Col sm={9}>
            <Row noGutters={true} className="mb-3 justify-content-around justify-content-sm-start align-items-center">
              <span className="mr-3 font-italic p-p-username">{profileLoaded && profile.user.username}</span>
              {authorized ?
                <><Link to="/profile/edit"><Button variant="light" className="font-weight-bold">Редактировать Профиль</Button></Link> <LogoutIcon /></> :
                followButton}
            </Row>
            <div className="mb-3 justify-content-around justify-content-sm-start">
              <span className="mr-5">
                <span className="font-weight-bold">{profileLoaded && profile.user_posts_count}</span> {pluralize('post', profileLoaded && profile.user_posts_count)}
              </span>
              {/* "подписчики" are "followers" */}
              <span
                className="mr-5 cursor-pointer"
                onClick={() => this.toggleModal('Подписчики:')}>
                <span className="font-weight-bold">{profileLoaded && profile.followers_count}</span> {pluralize('follower', profileLoaded && profile.followers_count)}
              </span>
              <span
                className="cursor-pointer"
                onClick={() => this.toggleModal('Подписки:')}>
                <span className="font-weight-bold">{profileLoaded && profile.following_count}</span> {pluralize('following', profileLoaded && profile.following_count)}
              </span>
            </div>
            <div className="mb-1 font-weight-bold">{profileLoaded && profile.user.first_name} {profileLoaded && profile.user.last_name}</div>
            <div>{profileLoaded && profile.info}</div>
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
        <PostGrid profile_id={parseInt(this.props.match.params.id, 10)} savedPosts={this.state.savedPosts} />
        {this.props.modalOpen && <PostDetailModal />}
        <UserListModal
          show={this.state.showUserListModal}
          title={this.state.title}
          toggleModal={this.toggleModal}
          id={parseInt(this.props.match.params.id, 10)}
          page={page}
        />
      </React.Fragment>
    )
  }
}


// make state available to Profile component though props
const mapStateToProps = state => ({
  authUser: state.auth.user,
  profile: state.profile.profileData,
  modalOpen: state.modal.modalOpen
});


export default connect(mapStateToProps, { loadProfile, removeUserList, removeProfile })(Profile);
