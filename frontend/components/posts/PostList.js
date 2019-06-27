import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { loadPostList, deletePost } from '../../actions/postList';
import Post from './Post';


class PostList extends React.Component {
  // check if the right type of props is provided
  static propTypes = {
    posts: PropTypes.array.isRequired,
    loadPostList: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.loadPostList();
  }

  render() {
    return (
      <div>
        {/* loop through posts */}
        {this.props.posts.map(
          post => <Post key={post.id} post={post} deletePost={this.props.deletePost} />
        )}
      </div>
    )
  }
}


// make state available to Posts component though props
const mapStateToProps = state => ({
  posts: state.postList
});


// connect React component to a Redux store
export default connect(mapStateToProps, { loadPostList, deletePost })(PostList)