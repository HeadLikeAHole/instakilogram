import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from "react-bootstrap/Image";
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import russianStrings from 'react-timeago/lib/language-strings/ru';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { connect } from 'react-redux';

import './comment.css';
import ReplyList from './ReplyList';
import { addCommentFormInfo } from '../../actions/commentFormInfo';
import CommentEditDelete from './CommentEditDelete';
import CommentLike from './CommentLike';

// choose Russian language in timestamp
const formatter = buildFormatter(russianStrings);

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {visible: false}
  }

  static propTypes = {
    comment: PropTypes.object.isRequired,
    addCommentFormInfo: PropTypes.func.isRequired
  };

  handleMouseEnter = () => this.setState({visible: !this.state.visible});

  handleReply = e => {
    e.preventDefault();
    const { comment } = this.props;
    let parent_id;
    // check if it's a reply to a comment or to another reply
    if (comment.parent) {
      parent_id = comment.parent
    } else {
      parent_id = comment.id
    }
    this.props.addCommentFormInfo({username: comment.username, parent_id: parent_id})
  };

  render() {
    const { authUser, comment } = this.props;

    // check if current logged in user is comment owner
    let isOwner = false;
    let isLiked = false;
    if (authUser) {
      if (authUser.id === comment.user) {
        isOwner = true
      }
      if (comment.likes) {
        if (comment.likes.includes(authUser.id)) {
          isLiked = true
        }
      }
    }

    return (
      <React.Fragment>
        <Col xs={2} className="px-3 py-2 text-center align-self-start">
          <Link to={`/profile/${comment.user}`}>
            <Image src={comment.profile_image} roundedCircle fluid className="p-d-profile-img" />
          </Link>
        </Col>
        <Col xs={10} className="py-1" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseEnter}>
          <div>
            <Link to={`/profile/${comment.user}`} className="mr-1 post-username-link">{comment.username}</Link>
            <span className="text-break">{comment.text}</span>
          </div>
          <div className="my-2 text-muted comment-info">
            <TimeAgo date={comment.published} formatter={formatter} />
            <span className="mx-3">123 likes</span>
            {/* reply link */}
            <a href="" className="text-muted" onClick={this.handleReply}>Ответить</a>
            {/* heart icon (like button) */}
            {comment.id && <CommentLike comment_id={comment.id} isLiked={isLiked} reply={!!comment.parent} />}
            {isOwner && <CommentEditDelete comment={comment} visible={this.state.visible} />}
          </div>
          <Row noGutters={true}>
            {comment.replies && <ReplyList replies={comment.replies} />}
          </Row>
        </Col>
      </React.Fragment>
    );
  }
}


const mapStateToProps = state => ({
  authUser: state.auth.user
});


export default connect(mapStateToProps, { addCommentFormInfo })(Comment);
