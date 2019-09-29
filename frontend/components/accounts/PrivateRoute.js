import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';


const PrivateRoute = ({ component: Component, auth, ...rest }) => {
  return (
    <Route {...rest} render={props => {
      if (auth.isLoading) {
        return <div className="my-5 text-center"><Spinner animation="grow" /></div>
      } else if (!auth.isAuthenticated) {
        return <Redirect to="/login" />
      } else {
        return <Component {...props} />
      }
    }}/>
  )
};


PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
  auth: state.auth
});


export default connect(mapStateToProps)(PrivateRoute)
