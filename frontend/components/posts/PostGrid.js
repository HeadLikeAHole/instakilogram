import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
  posts: PropTypes.array.isRequired
};


const mapStateToProps = state => ({
  posts: state.postSlider.posts,
});


export default connect(mapStateToProps)(PostGrid);
