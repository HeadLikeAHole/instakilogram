import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';


import { loadPostListSearch, deletePost, removePostList } from '../../actions/postList';
import Post from './Post';
import './post.css';


class PostListSearch extends React.Component {
  // check if the right type of props is provided
  static propTypes = {
    postList: PropTypes.object.isRequired,
    loadPostListSearch: PropTypes.func.isRequired,
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
        this.props.loadPostListSearch(next);
      }
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    // extract query from url and pass it to loadPostListSearch function so search persists on page refresh
    const query = this.props.location.search.slice(7);
    this.props.loadPostListSearch(null, query);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    this.props.removePostList()
  }

  render() {
    const { posts, count, isLoading } = this.props.postList;
    const query = this.props.location.search.slice(7);

    let match = false;
    if (posts && posts.length > 0) match = true;

    let noMatch = false;
    if (posts && posts.length === 0) noMatch = true;

    const card1 = (
      <Card className="mx-auto mt-5 no-posts-yet my-container">
        <Card.Body>
          По запросу "{query}" найдено <span className="font-weight-bold">{posts && count}</span> фото
        </Card.Body>
      </Card>
    );

    const card2 = (
      <Card className="mx-auto mt-5 no-posts-yet my-container">
        <Card.Body>
          По запросу "{query}" ничего не найдено
        </Card.Body>
      </Card>
    );

    return (
      <>
        {/* if there is a match display card1 */}
        {match && card1}
        {/* if no posts match query display card2 */}
        {noMatch && card2}
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
export default connect(mapStateToProps, { loadPostListSearch, deletePost, removePostList })(PostListSearch)
