import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';


import './post.css';
import PostEditDelete from './PostEditDelete';
import PostLike from './PostLike';
import PostSave from './PostSave';


const Post = props => {
  const { authUser, post } = props;
  // user variable is post author's user's id
  const { id, username, profile_image, image, description, user, likes } = props.post;

  // check if current logged in user is post owner, has liked post, has saved post
  let isOwner = false;
  let isLiked = false;
  let isSaved = false;
  if (authUser) {
    if (authUser.id === user) {
      isOwner = true
    }
    if (likes) {
      if (likes.includes(authUser.id)) {
        isLiked = true
      }
    }
    if (authUser.saved_posts.includes(id)) {
      isSaved = true;
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
          {id && <PostLike post_id={id} isLiked={isLiked} postDetail={false} />}
          <Link to={`/posts/${id}`}><i className="far fa-comment my-icon"></i></Link>
          {/* user id and profile id are the same number */}
          {authUser && id && <PostSave profile_id={authUser.id} post_id={id} isSaved={isSaved} />}
        </div>
        {description}
      </Card.Body>
    </Card>
  );
};


Post.propTypes = {
  authUser: PropTypes.object,
  post: PropTypes.object.isRequired
};


// make state available to Post component though props
const mapStateToProps = state => ({
  authUser: state.auth.user
});


export default connect(mapStateToProps)(Post);
