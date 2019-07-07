import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { Link } from 'react-router-dom';

import './post-hover.css';


// post thumbnail display in profile page
const PostHover = props => {
  return (
    <Row className="hover">
      <div>
        <i className="fas fa-heart"></i> 150k
      </div>
      <div>
        <i className="fas fa-comment"></i> 758
      </div>
    </Row>
  );
};


// PostHover.propTypes = {
//   post: PropTypes.object.isRequired
// };


export default PostHover;