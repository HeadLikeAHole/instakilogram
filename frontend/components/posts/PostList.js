import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner'

import { loadPostList, deletePost } from '../../actions/postList';
import Post from './Post';


class PostList extends React.Component {
  // check if the right type of props is provided
  static propTypes = {
    postList: PropTypes.object.isRequired,
    loadPostList: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired
  };

  // infinite scroll
  handleScroll = () => {
    const { isLoading, next } = this.props.postList;
      if (isLoading || !next) return;
      if (
        document.documentElement.scrollHeight - document.documentElement.scrollTop ===
        document.documentElement.clientHeight
      ) {
        this.props.loadPostList(next);
      }
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.props.loadPostList();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const { posts, isLoading } = this.props.postList;

    return (
      <>
        <div>
          {/* loop through posts */}
          {posts.map(
            post => <Post key={post.id} post={post} deletePost={this.props.deletePost} />
          )}
        </div>
        {isLoading && <div className="my-5 text-center"><Spinner animation="grow" /></div>}
     </>
    )
  }
}


// make state available to PostList component though props
const mapStateToProps = state => ({
  postList: state.postList
});


// connect React component to Redux store
export default connect(mapStateToProps, { loadPostList, deletePost })(PostList)
