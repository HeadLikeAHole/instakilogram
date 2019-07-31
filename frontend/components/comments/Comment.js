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
import { addReplyInfo } from '../../actions/reply';

// choose Russian language in timestamp
const formatter = buildFormatter(russianStrings);

const Comment = props => {
  const { comment } = props;

  const handleReply = e => {
    e.preventDefault();
    let parent_id;
    if (comment.parent) {
      parent_id = comment.parent
    } else {
      parent_id = comment.id
    }
    props.addReplyInfo({comment_id: comment.id, username: comment.username, parent_id: parent_id})
  };

  return (
    <React.Fragment>
      <Col xs={2} className="px-3 py-2 text-center align-self-start">
        <Link to={`/profile/${comment.user}`}>
          <Image src={comment.profile_image} roundedCircle fluid className="p-d-profile-img" />
        </Link>
      </Col>
      <Col xs={10} className="py-1">
        <div>
          <Link to={`/profile/${comment.user}`} className="mr-1 post-username-link">{comment.username}</Link>
          <span className="text-break">{comment.text}</span>
        </div>
        <div className="my-2 text-muted comment-info">
          <TimeAgo date={comment.published} formatter={formatter} />
          <span className="mx-3">123 likes</span>
          {/* reply link */}
          <a href="" className="text-muted" onClick={handleReply}>Reply</a>
        </div>
        <Row noGutters={true}>
          {comment.replies && <ReplyList replies={comment.replies} />}
        </Row>
      </Col>
    </React.Fragment>
  );
};


Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  addReplyInfo: PropTypes.func.isRequired
};


export default connect(null, { addReplyInfo })(Comment);
