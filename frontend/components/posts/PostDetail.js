import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './post-detail.css';
import './post.css';
import { loadPostDetail } from '../../actions/postDetail';
import PostEditDelete from './PostEditDelete';
import CommentList from '../comments/CommentList';
import CommentForm from '../comments/CommentForm';


class PostDetail extends React.Component {
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

  render() {
    const { authUser, post } = this.props;

    // check if current logged in user is post author
    let authorized = false;
    if (authUser) {
      if (authUser.id === post.user) {
        authorized = true
      }
    }

    return (
      // "p-d" in class names stands for post detail
      // "noGutters={true}" removes the gutter spacing between Cols as well as any added negative margins
      // display "p-d-border" class if post detail is accessed through post list and not profile page
      <Row noGutters={true} className={`mt-5 ${post.id || "p-d-border"}`}>
        {/* post image */}
        <Col lg={7} className="align-self-center">
          <Image src={post.image} className="w-100 p-d-image" />
        </Col>
        <Col className="bg-white">
          {/* post author */}
          <Row noGutters={true} className="p-3 align-items-center p-d-border-bottom">
            <Col>
              <Link to={`/profile/${post.user}`}>
                <Image src={post.profile_image} roundedCircle fluid className="mr-2 p-d-profile-img" />
              </Link>
              <Link to={`/profile/${post.user}`} className="post-username-link">{post.username}</Link>
              {authorized && <PostEditDelete post={post} />}
            </Col>
          </Row>
          {/* post description */}
          <Row noGutters={true} className="p-3 p-d-border-bottom">
            {post.description}
          </Row>
          {/* comments */}
          <Row noGutters={true} className="align-items-center p-d-border-bottom comments">
            {post.id && <CommentList post_id={post.id} />}
          </Row>
          {/* icons */}
          <Row noGutters={true} className="p-3 align-content-center p-d-border-bottom">
            <i className="far fa-heart my-icon"></i>
            <i className="far fa-comment my-icon"></i>
            <i className="far fa-bookmark my-icon"></i>
          </Row>
          {/* add comment field */}
          <Row noGutters={true} className="px-3 py-2 justify-content-between align-content-center p-d-border-bottom">
            {post.id && <CommentForm post_id={post.id} />}
          </Row>
        </Col>
      </Row>
    );
  }
}


PostDetail.propTypes = {
  authUser: PropTypes.object,
  post: PropTypes.object.isRequired,
  loadPostDetail: PropTypes.func.isRequired,
  post_id: PropTypes.number
};


// make state available to PostDetail component though props
const mapStateToProps = state => ({
  authUser: state.auth.user,
  post: state.postDetail,
  post_id: state.postSlider.id
});


export default connect(mapStateToProps, { loadPostDetail })(PostDetail);
