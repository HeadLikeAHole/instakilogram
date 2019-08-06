import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Comment from './Comment';
import { loadCommentList } from '../../actions/commentList';


class CommentList extends React.Component {
  // check if the right type of props is provided
  static propTypes = {
    post_id: PropTypes.number.isRequired,
    loadCommentList: PropTypes.func.isRequired,
    comments: PropTypes.array.isRequired,
  };

  componentDidMount() {
    this.props.loadCommentList(this.props.post_id);
  }

  // update component when sliding posts in profile page
  componentDidUpdate(prevProps) {
    if (this.props.post_id !== prevProps.post_id) {
      this.props.loadCommentList(this.props.post_id);
    }
  }

  render() {
    return (
      <React.Fragment>
        {/* loop through comments */}
        {this.props.comments.map(
          comment => <Comment key={comment.id} comment={comment} />
        )}
      </React.Fragment>
    )
  }
}


// make state available to CommentList component though props
const mapStateToProps = state => ({
  comments: state.commentList
});


// connect React component to Redux store
export default connect(mapStateToProps, { loadCommentList })(CommentList)
