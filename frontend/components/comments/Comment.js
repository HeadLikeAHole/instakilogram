import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
import { pluralize } from '../../helperFunctions';
import UserListModal from "../common/UserListModal";
import ProfileImage from "../common/ProfileImage";


// select Russian language in timestamp
const formatter = buildFormatter(russianStrings);

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editDeleteVisible: false,
      showReplies: true,
      showUserListModal: false
    }
  }

  static propTypes = {
    comment: PropTypes.object.isRequired,
    addCommentFormInfo: PropTypes.func.isRequired
  };

  // make 3 dots visible on mouse enter
  showDots = () => this.setState({editDeleteVisible: true});

  // make 3 dots invisible on mouse leave
  hideDots = () => this.setState({editDeleteVisible: false});

  // show and hide dots on touch (for mobile devices)
  handleTouch = () => this.setState({editDeleteVisible: !this.state.editDeleteVisible});

  handleShowHideReplies = () => this.setState({showReplies: !this.state.showReplies});

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

  toggleModal = () => this.setState({showUserListModal: !this.state.showUserListModal});

  render() {
    const { authUser, comment } = this.props;

    let isOwner = false;
    let isLiked = false;

    if (Object.keys(this.props.authUser).length) {
      // check if current logged in user is comment owner
      if (authUser.id === comment.user) {
        isOwner = true
      }
      // check if user has already liked the comment
      if (comment.likes.includes(authUser.id)) {
        isLiked = true
      }

    }

    // check if comment has been edited, if it has then display (ред.) after time published
    let edited = false;
    if (comment.published !== comment.updated) {
      edited = true
    }

    let replyShowHide;
    if (this.state.showReplies) {
      replyShowHide = `----- Показать ${comment.replies_count} ${pluralize('reply', comment.replies_count)}`
    } else {
      replyShowHide = '----- Скрыть ответы'
    }

    return (
      <Row noGutters={true} className="justify-content-start">
        <Col xs="auto" className="px-3 py-2">
          <Link to={`/profile/${comment.user}`}>
            <ProfileImage src={comment.profile_image} className="profile-img" />
          </Link>
        </Col>
        <Col className="py-1">
          {/* comment's user avatar */}
          <Row noGutters={true} className="justify-content-between">
            <Col onMouseEnter={this.showDots} onMouseLeave={this.hideDots} onTouchStart={this.handleTouch}>
              <Link to={`/profile/${comment.user}`} title={comment.username} className="mr-2 username-link">{comment.username}</Link>
              <span className="text-break">{comment.text}</span>
            </Col>
            <Col xs="auto" onMouseEnter={this.showDots} onMouseLeave={this.hideDots} onTouchStart={this.handleTouch}>
              {/* heart icon (like button) */}
              {isOwner && <CommentEditDelete comment={comment} visible={this.state.editDeleteVisible} />}
              <CommentLike comment_id={comment.id} isLiked={isLiked} reply={!!comment.parent} />
            </Col>
          </Row>
          <div className="my-2 text-muted comment-info">
            <TimeAgo date={comment.published} formatter={formatter} /> {edited && <span className="comment-updated">(ред.)</span>}
            <span className="mx-2 cursor-pointer" onClick={this.toggleModal}>{comment.likes_count} {pluralize('like', comment.likes_count)}</span>
            {/* reply link */}
            <a href="" className="text-muted" onClick={this.handleReply}>Ответить</a>
          </div>
          <div className="mb-1">
            <span className="reply-show-hide cursor-pointer" onClick={this.handleShowHideReplies}>
              {comment.replies_count ? replyShowHide : ''}
            </span>
          </div>
          <Row noGutters={true}>
            {comment.replies && !this.state.showReplies && <ReplyList comment={comment} />}
          </Row>
        </Col>
        <UserListModal
          show={this.state.showUserListModal}
          title='Комментарий лайкнули:'
          toggleModal={this.toggleModal}
          id={comment.id}
        />
      </Row>
    );
  }
}


const mapStateToProps = state => ({
  authUser: state.auth.user
});


export default connect(mapStateToProps, { addCommentFormInfo })(Comment);
