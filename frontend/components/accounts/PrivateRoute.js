import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';


const PrivateRoute = ({ component: Component, auth, ...rest }) => {
  return (
    <Route {...rest} render={props => {
      if (auth.isLoading) {
        return <Spinner animation="grow" className="mx-auto my-2" />
      } else if (!auth.isAuthenticated) {
        return <Redirect to="/login" />
      } else {
        return <Component {...props} />
      }
    }}/>
  )
};


const mapStateToProps = state => ({
  auth: state.auth
});


export default connect(mapStateToProps)(PrivateRoute)