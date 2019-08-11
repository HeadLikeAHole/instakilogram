import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';

import { likePost } from '../../actions/postList';


class PostLike extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    }
  }

  static propTypes = {
    likePost: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    post_id: PropTypes.number.isRequired,
    isLiked: PropTypes.bool.isRequired,
    postDetail: PropTypes.bool.isRequired
  };

  handleLike = () => {
    if (this.props.isAuthenticated) {
      this.props.likePost(this.props.post_id, this.props.postDetail)
    } else {
      this.setState({ redirect: true })
    }
  };

  render() {
    return (
      <React.Fragment>
        {/* if user is not authenticated on heart icon click he is redirected to login page*/}
        {!this.state.redirect ?
          // if post has been liked then heart icon turns solid red if clicked again it turns back to outlined gray
          <i className={`${this.props.isLiked ? 'fas liked' : 'far'} fa-heart my-icon`} onClick={this.handleLike}></i> :
          <Redirect to="/login" />}
      </React.Fragment>
    )
  }
}


const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});


export default connect(mapStateToProps, { likePost })(PostLike);
