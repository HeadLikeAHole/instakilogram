import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Col';

import './post-hover.css';


// post thumbnail display in profile page
const PostHover = props => {
  return (
    <Row className="hover cursor-pointer">
      <div>
        <i className="fas fa-heart"></i> {props.likes_count}
      </div>
      <div>
        <i className="fas fa-comment"></i> {props.comments_count}
      </div>
    </Row>
  );
};


PostHover.propTypes = {
  likes_count: PropTypes.number.isRequired,
  comments_count: PropTypes.number.isRequired
};


export default PostHover;
