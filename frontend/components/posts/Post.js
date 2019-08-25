import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import russianStrings from 'react-timeago/lib/language-strings/ru';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

import './post.css';
import PostEditDelete from './PostEditDelete';
import PostLikeIcon from './PostLikeIcon';
import PostSaveIcon from './PostSaveIcon';
import { pluralize } from '../../helperFunctions';
import UserListModal from '../common/UserListModal';


// select Russian language in timestamp
const formatter = buildFormatter(russianStrings);


class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showUserListModal: false}
  }

  static propTypes = {
    authUser: PropTypes.object,
    post: PropTypes.object.isRequired
  };

  toggleModal = () => this.setState({showUserListModal: !this.state.showUserListModal});

  render() {
    const { authUser, post } = this.props;
    // user variable is post author's user's id
    const { id, username, profile_image, user, image, description, comments_count, likes, likes_count } = this.props.post;

    // check if current logged in user is post owner
    let isOwner = false;
    if (authUser) {
      if (authUser.id === user) {
        isOwner = true
      }
    }

    return (
      <Card className="mx-auto my-5 my-container">
        <Card.Body className="p-3">
          <Row>
            <Col>
              {/* user's profile picture and username are wrapped in links where {user} is user's id which is the same as user's profile id */}
              <Link to={`/profile/${user}`}><Image src={profile_image} roundedCircle className="mr-2 post-profile-img" /></Link>
              <Link to={`/profile/${user}`} className="post-username-link">{username}</Link>
              {/* if user is owner of the post display dropdown menu */}
              {isOwner && <PostEditDelete post={post} />}
            </Col>
          </Row>
        </Card.Body>
        <Card.Img variant="top" src={image} className="post-image" />
        <Card.Body className="p-3">
          <div className="my-1">
            {id && <PostLikeIcon post_id={id} likes={likes} postDetail={false} />}
            <Link to={`/posts/${id}`}><i className="far fa-comment my-icon"></i></Link>
            {/* user id and profile id are the same number */}
            {id && <PostSaveIcon post_id={id} />}
            <span className="float-right time-ago"><TimeAgo date={post.published} formatter={formatter} /></span>
          </div>
          <div className="mt-1 mb-3 likes-count">
            <span className="cursor-pointer" onClick={this.toggleModal}>{likes_count} {pluralize('like', likes_count)}</span>
          </div>
          <div>
            {description}
          </div>
          <div className="mt-2 comments-count">
            <Link to={`/posts/${id}`}>Посмотреть комментарии ({comments_count})</Link>
          </div>
        </Card.Body>
        <UserListModal
          show={this.state.showUserListModal}
          title='публикацию лайкнули'
          toggleModal={this.toggleModal}
          id={id}
        />
      </Card>
    );
  }
}


// make state available to Post component though props
const mapStateToProps = state => ({
  authUser: state.auth.user
});


export default connect(mapStateToProps)(Post);
