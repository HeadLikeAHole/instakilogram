import React from 'react';
import PropTypes from 'prop-types';

import User from './User';


const UserList = props => {
  return (
    <>
      {props.users.map(
        user => <User key={user.id} user={user} page={props.page} />
      )}
    </>
  )
};


UserList.propTypes = {
  users: PropTypes.array.isRequired,
  page: PropTypes.string
};


export default UserList;