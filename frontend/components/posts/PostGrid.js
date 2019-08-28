import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner'

import PostTile from './PostTile';
import { loadPostSlider, removePostSlider } from '../../actions/postSlider';


class PostGrid extends React.Component {
  static propTypes = {
    loadPostSlider: PropTypes.func.isRequired,
    removePostSlider: PropTypes.func.isRequired,
    postSlider: PropTypes.object.isRequired,
    profile_id: PropTypes.number.isRequired,
    savedPosts: PropTypes.string
  };

  // infinite scroll
  handleScroll = () => {
    const { isLoading, next } = this.props.postSlider;
      if (isLoading || !next) return;
      if (
        document.documentElement.scrollHeight - document.documentElement.scrollTop ===
        document.documentElement.clientHeight
      ) {
        this.props.loadPostSlider(this.props.profile_id, this.props.savedPosts, next);
      }
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.props.loadPostSlider(this.props.profile_id, this.props.savedPosts)
  }
  // "this.props.profile_id !== prevProps.profile_id" makes component re-render
  // when navigating from someone's profile to own profile
  // without it previous profile's user's posts are displayed in own profile
  componentDidUpdate(prevProps) {
    if (this.props.profile_id !== prevProps.profile_id || this.props.savedPosts !== prevProps.savedPosts) {
      this.props.loadPostSlider(this.props.profile_id, this.props.savedPosts)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    // remove post slider object from the redux store so when user goes to another profile page
    // he doesn't see posts from previous profile page while current profile page's posts are loading
    this.props.removePostSlider()
  }

  render() {
    const { isLoading, posts} = this.props.postSlider;
    return (
      <Row>
        {/* loop through posts */}
        {posts.map(
          post => <PostTile key={post.id} post={post} />
        )}
        {isLoading && <div className="w-100 my-3 text-center"><Spinner animation="grow" className="comment-spinner" /></div>}
      </Row>
    )
  }
}


const mapStateToProps = state => ({
  postSlider: state.postSlider
});


export default connect(mapStateToProps, { loadPostSlider, removePostSlider })(PostGrid);
