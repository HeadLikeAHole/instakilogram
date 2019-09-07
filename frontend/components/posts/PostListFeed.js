import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';


import { loadPostListFeed, deletePost, removePostList } from '../../actions/postList';
import Post from './Post';
import './post.css';


class PostListFeed extends React.Component {
  // check if the right type of props is provided
  static propTypes = {
    postList: PropTypes.object.isRequired,
    loadPostListFeed: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
    removePostList: PropTypes.func.isRequired
  };

  // infinite scroll
  handleScroll = () => {
    const { isLoading, next } = this.props.postList;
      if (isLoading || !next) return;
      if (
        document.documentElement.scrollHeight - document.documentElement.scrollTop ===
        document.documentElement.clientHeight
      ) {
        this.props.loadPostListFeed(next);
      }
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.props.loadPostListFeed();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    this.props.removePostList()
  }

  render() {
    const { posts, isLoading } = this.props.postList;

    let noPostsYet = false;
    if (posts && posts.length === 0) noPostsYet = true;

    const card = (
      <Card className="mx-auto mt-5 no-posts-yet my-container">
        <Card.Body>
          В вашей ленте пока ничего нет.
          Добавьте фото или подпишитесь на чей-либо аккаунт, чтобы видеть их фотографии.
          Чтобы найти интересующий вас аккаунт используейте поиск.
        </Card.Body>
      </Card>
    );

    return (
      <>
        {/* if no posts sent by server display card */}
        {noPostsYet && card}
        <div>
          {/* loop through posts */}
          {posts && posts.map(
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
export default connect(mapStateToProps, { loadPostListFeed, deletePost, removePostList })(PostListFeed)
