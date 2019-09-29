import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';

import { likePost } from '../../actions/postList';


class PostLikeIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {redirect: false}
  }

  static propTypes = {
    likePost: PropTypes.func.isRequired,
    authUser: PropTypes.object.isRequired,
    post_id: PropTypes.number.isRequired,
    likes: PropTypes.array.isRequired,
    postDetail: PropTypes.bool.isRequired
  };

  handleLike = () => {
    if (this.props.authUser.isAuthenticated) {
      this.props.likePost(this.props.post_id, this.props.postDetail)
    } else {
      this.setState({ redirect: true })
    }
  };

  render() {
    const { authUser, likes } = this.props;

    let isLiked = false;
    if (Object.keys(authUser.user).length > 0) {
      if (likes.includes(authUser.user.id)) {
        isLiked = true;
      }
    }

    return (
      <React.Fragment>
        {/* if user is not authenticated on heart icon click he is redirected to login page*/}
        {!this.state.redirect ?
          // if post has been liked then heart icon turns solid red if clicked again it turns back to outlined gray
          <i className={`${isLiked ? 'fas liked' : 'far'} fa-heart my-icon`} onClick={this.handleLike}></i> :
          <Redirect push to="/login" />}
      </React.Fragment>
    )
  }
}


const mapStateToProps = state => ({
  authUser: state.auth
});


export default connect(mapStateToProps, { likePost })(PostLikeIcon);
