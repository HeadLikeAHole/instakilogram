import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';

import { likeComment } from '../../actions/commentList';


class CommentLike extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    }
  }

  static propTypes = {
    likeComment: PropTypes.func.isRequired,
    comment_id: PropTypes.number.isRequired,
    isLiked: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
  };

  handleLike = () => {
    if (this.props.isAuthenticated) {
      this.props.likeComment(this.props.comment_id, this.props.reply)
    } else {
      this.setState({ redirect: true })
    }
  };

  render() {
    return (
      <React.Fragment>
        {/* if user is not authenticated on heart icon click he redirected to login page*/}
        {!this.state.redirect ?
          // if post has been liked heart icon turns solid red if clicked again it turns back to outlined gray
          <i className={`${this.props.isLiked ? 'fas liked' : 'far'} fa-heart comment-like`} onClick={this.handleLike}></i> :
          <Redirect to="/login" />}
      </React.Fragment>
    )
  }
}


const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});


export default connect(mapStateToProps, { likeComment })(CommentLike);
