import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';

import PostTile from './PostTile';


const PostGrid = props => {
  return (
      <Row>
        {/* loop through posts */}
        {props.posts.map(
          post => <PostTile key={post.id} post={post} />
        )}
      </Row>
  )
};


PostGrid.propTypes = {
  posts: PropTypes.object.isRequired
};


export default PostGrid;