import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import FollowButton from './FollowButton';
import { Link } from 'react-router-dom';

import ProfileImage from './ProfileImage';


const User = props => {
  return (
    <Row noGutters={true} className="mb-2 justify-content-between">
      <Row noGutters={true} className="align-items-center">
        <Link to={`/profile/${props.user.id}`}><ProfileImage src={props.user.image} className="mr-2 profile-img cursor-pointer" /></Link>
        <Link to={`/profile/${props.user.id}`} className="cursor-pointer username-link">{props.user.username}</Link>
      </Row>
      {/* profile and user ids are the same*/}
      <FollowButton profile_id={props.user.id} followers={props.user.followers} page={props.page} />
    </Row>
  )
};


User.propTypes = {
  // authenticated user
  authUser: PropTypes.object.isRequired,
  // user which is a follower or following or liker
  user: PropTypes.object.isRequired,
  page: PropTypes.string
};


const mapStateToProps = state => ({
  authUser: state.auth.user
});


export default connect(mapStateToProps)(User);