import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner'

import Comment from './Comment';
import { loadMoreReplies } from '../../actions/commentList';


class ReplyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 2,
    }
  }

  static propTypes = {
    comment: PropTypes.object.isRequired,
    repliesLoading: PropTypes.bool.isRequired
  };

  handleClick = () => {
    this.props.loadMoreReplies(this.props.comment.id, this.state.pageNumber);
    this.setState({pageNumber: this.state.pageNumber + 1})
  };

  render() {
    const { replies, replies_count } = this.props.comment;
    let loadMore = false;
    if (replies_count > replies.length) {
      loadMore = true
    }

    const spinner = (
      <div className="w-100 text-center"><Spinner animation="grow" size="sm" /></div>
    );

    const loadMoreButton = (
      <div className="w-100 text-center">
        <span className="load-more cursor-pointer" onClick={this.handleClick}>
          {loadMore && `----- Еще ответы (${replies_count - replies.length}) -----`}
        </span>
      </div>
    );

    return (
      <React.Fragment>
        {/* loop through replies */}
        {replies.map(
          comment => <Comment key={comment.id} comment={comment} />
        )}
        {this.props.repliesLoading ? spinner : loadMoreButton}
      </React.Fragment>
    )
  }
}


const mapStateToProps = state => ({
  repliesLoading: state.commentList.repliesLoading
});


export default connect(mapStateToProps, { loadMoreReplies })(ReplyList);
