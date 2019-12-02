import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import russianStrings from 'react-timeago/lib/language-strings/ru';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

import './post-detail.css';
import './post.css';
import { loadPostDetail } from '../../actions/postDetail';
import PostEditDelete from './PostEditDelete';
import CommentList from '../comments/CommentList';
import CommentForm from '../comments/CommentForm';
import PostLikeIcon from './PostLikeIcon';
import PostSaveIcon from './PostSaveIcon';
import { pluralize } from '../../helperFunctions';
import UserListModal from '../common/UserListModal';
import ProfileImage from '../common/ProfileImage';


// select Russian language in timestamp
const formatter = buildFormatter(russianStrings);


class PostDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showUserListModal: false};
  }

  static propTypes = {
    authUser: PropTypes.object,
    post: PropTypes.object.isRequired,
    loadPostDetail: PropTypes.func.isRequired,
    post_id: PropTypes.number
  };

  toggleModal = () => this.setState({showUserListModal: !this.state.showUserListModal});

  componentDidMount() {
    // check where id comes from
    // it's either from url if post is clicked in post list
    // or from props which are supplied when post is clicked in profile page
    let id;
    if (this.props.match) {
      id = this.props.match.params.id
    } else {
      id = this.props.post_id
    }
    this.props.loadPostDetail(id);
  }

  // update component when sliding posts in profile page
  componentDidUpdate(prevProps) {
    if (this.props.post_id !== prevProps.post_id) {
      this.props.loadPostDetail(this.props.post_id);
    }
  }

  // remove post detail from the state so the right comments are loaded when navigating to another post detail
  // since new post detail doesn't have enough time to load and comments use id of previous post
  componentWillUnmount() {
    this.props.loadPostDetail()
  }

  render() {
    const { authUser, post } = this.props;
    const { id, username, profile_image, user, image, description, published, updated, comments_count, likes, likes_count } = this.props.post;

    // check if post object has loaded
    let postLoaded = false;
    if (Object.keys(post).length) {
      postLoaded = true
    }

    let isOwner = false;
    // check if user object has loaded
    if (Object.keys(authUser).length) {
      // check if current logged in user is post owner
      if (authUser.id === user) {
        isOwner = true
      }
    }

    // if post has been edited later than 60s after first publishing
    // then display time of the edit in parentheses after time it was first published
    let edited = false;
    if (new Date(updated).getTime() - new Date(published).getTime() > 60000) {
      edited = true
    }

    return (
      // "p-d" in class names stands for post detail
      // "noGutters={true}" removes the gutter spacing between Cols as well as any added negative margins
      // display "p-d-border" class if post detail is accessed through post list and not profile page slider
      <Row noGutters={true} className={`my-5 align-items-start bg-white ${this.props.match && "p-d-border"}`}>
        {/* post image */}
        <Col lg={7} className="align-self-center">
          <Image src={image} className="w-100 p-d-image" />
        </Col>
        <Col className="p-d-border-left" id="right-col">
          {/* post author */}
          <Row noGutters={true} className="p-3 justify-content-between p-d-border-bottom">
            <Row noGutters={true} className="align-items-center">
              <Link to={`/profile/${postLoaded && user}`}>
                <ProfileImage src={profile_image} className="mr-2 profile-img" />
              </Link>
              <Link to={`/profile/${postLoaded && user}`} title={postLoaded ? username : ''} className="truncate-username username-link p-d-username">{postLoaded && username}</Link>
            </Row>
            {postLoaded && isOwner && <PostEditDelete post={post} />}
          </Row>
          {/* post description */}
          <Row noGutters={true} className="p-3 p-d-border-bottom">
            {postLoaded && description}
          </Row>
          {/* comments */}
          <div className="comments-parent">
            {postLoaded && <CommentList post_id={id} />}
          </div>
          {/* icons */}
          <Row noGutters={true} className="p-3 justify-content-between align-content-center p-d-border-bottom">
            <div>
              {postLoaded && <PostLikeIcon post_id={id} likes={likes} postDetail={true} />}
              {postLoaded && <PostSaveIcon post_id={id} />}
            </div>
            <div className="float-right time-ago">
              {postLoaded && <TimeAgo date={published} formatter={formatter} />}
              {postLoaded && edited && <span className="ml-1 post-updated">(ред. <TimeAgo date={updated} formatter={formatter} />)</span>}
            </div>
            <div className="my-2 w-100">
              <span className="cursor-pointer" onClick={this.toggleModal}>{postLoaded && likes_count} {pluralize('like', postLoaded && likes_count)}</span>
              <span className="mx-2">|</span>
              <span>{postLoaded && comments_count} {pluralize('comment', postLoaded && comments_count)}</span>
            </div>
          </Row>
          {/* add comment field */}
          <Row noGutters={true} className="px-3 py-2 justify-content-end">
            {postLoaded && <CommentForm post_id={id} />}
          </Row>
        </Col>
        {postLoaded &&
          <UserListModal
            show={this.state.showUserListModal}
            title='Публикацию лайкнули:'
            toggleModal={this.toggleModal}
            id={id}
          />
        }
      </Row>
    );
  }
}


// make state available to PostDetail component though props
const mapStateToProps = state => ({
  authUser: state.auth.user,
  post: state.postDetail,
  post_id: state.postSlider.id
});


export default connect(mapStateToProps, { loadPostDetail })(PostDetail);
