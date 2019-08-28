import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner'

import Comment from './Comment';
import { loadCommentList, removeCommentList } from '../../actions/commentList';


class CommentList extends React.Component {
  // check if the right type of props is provided
  static propTypes = {
    post_id: PropTypes.number.isRequired,
    loadCommentList: PropTypes.func.isRequired,
    removeCommentList: PropTypes.func.isRequired,
    commentList: PropTypes.object.isRequired,
  };

  handleLoadMore = () => this.props.loadCommentList(this.props.post_id, this.props.commentList.next);

  componentDidMount() {
    this.props.loadCommentList(this.props.post_id);
  }

  // update component when sliding posts in profile page
  componentDidUpdate(prevProps) {
    if (this.props.post_id !== prevProps.post_id) {
      // remove previous comment list from state when sliding posts in profile page so it's not visible
      // while next one is loading
      this.props.removeCommentList();
      this.props.loadCommentList(this.props.post_id);
    }
  }

  render() {
    const { commentsLoading, next, comments } = this.props.commentList;
    let plus = true;
    if (commentsLoading || !next) {
      plus = false
    }

    return (
      <Row noGutters={true} className={`pt-1 ${commentsLoading && 'align-items-center'} p-d-border-bottom comments-child`}>
        {/* loop through comments */}
        {comments.map(
          comment => <Comment key={comment.id} comment={comment} />
        )}
        {commentsLoading && <div className="w-100 text-center"><Spinner animation="grow" className="comment-spinner" /></div>}
        {plus && <div className="w-100"><i className="fas fa-plus my-plus" onClick={this.handleLoadMore}></i></div>}
      </Row>
    )
  }
}


// make state available to CommentList component though props
const mapStateToProps = state => ({
  commentList: state.commentList
});


// connect React component to Redux store
export default connect(mapStateToProps, { loadCommentList, removeCommentList })(CommentList)
