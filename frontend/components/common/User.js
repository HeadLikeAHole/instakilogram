import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import FollowButton from './FollowButton';



const User = props => {
  return (
    <Row noGutters={true} className="mb-2 justify-content-between">
      <span><Image src={props.user.image} roundedCircle className="profile-img" /> {props.user.username}</span>
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