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


// select Russian language in timestamp
const formatter = buildFormatter(russianStrings);


class PostDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showUserListModal: false}
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
    const { id, username, profile_image, user, image, description, comments_count, likes, likes_count } = this.props.post;

    // check if current logged in user is post owner
    let isOwner = false;
    if (Object.keys(authUser).length > 0) {
      if (authUser.id === user) {
        isOwner = true
      }
    }

    return (
      // "p-d" in class names stands for post detail
      // "noGutters={true}" removes the gutter spacing between Cols as well as any added negative margins
      // display "p-d-border" class if post detail is accessed through post list and not profile page
      <Row noGutters={true} className={`mt-5 ${id || "p-d-border"}`}>
        {/* post image */}
        <Col lg={7} className="align-self-center">
          <Image src={image} className="w-100 p-d-image" />
        </Col>
        <Col className="bg-white">
          {/* post author */}
          <Row noGutters={true} className="p-3 align-items-center p-d-border-bottom">
            <Col>
              <Link to={`/profile/${user}`}>
                <Image src={profile_image} roundedCircle fluid className="mr-2 p-d-profile-img" />
              </Link>
              <Link to={`/profile/${user}`} className="post-username-link">{username}</Link>
              {isOwner && <PostEditDelete post={post} />}
            </Col>
          </Row>
          {/* post description */}
          <Row noGutters={true} className="p-3 p-d-border-bottom">
            {description}
          </Row>
          {/* comments */}
          <div className="comments-parent">
            {id && <CommentList post_id={id} />}
          </div>
          {/* icons */}
          <Row noGutters={true} className="p-3 justify-content-between align-content-center p-d-border-bottom">
            <div>
              {id && <PostLikeIcon post_id={id} likes={likes} postDetail={true} />}
              <i className="far fa-comment my-icon"></i>
              {id && <PostSaveIcon post_id={id} />}
            </div>
            <div className="float-right time-ago">
              <TimeAgo date={post.published} formatter={formatter} />
            </div>
            <div className="w-100 my-1 likes-count">
              <span className="cursor-pointer" onClick={this.toggleModal}>{likes_count} {pluralize('like', likes_count)}</span>
            </div>
            <div className="">
              {comments_count} {pluralize('comment', comments_count)}
            </div>
          </Row>
          {/* add comment field */}
          <Row noGutters={true} className="px-3 py-2 justify-content-between align-content-center p-d-border-bottom">
            {id && <CommentForm post_id={id} />}
          </Row>
        </Col>
        {id &&
          <UserListModal
            show={this.state.showUserListModal}
            title='публикацию лайкнули'
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
