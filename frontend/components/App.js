import React from 'react';
import { Provider } from 'react-redux';
// HashRouter (adds pound sign to url) is used instead of BrowserRouter because on page reload
// browser will look for the page defined on the backend, which in our case defined on the frontend
// To use BrowserRouter during production server needs some configuring
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
// make alerts available in the whole app
// use alias because there is already a Provider component
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

import './app.css';
import store from '../store';
import Navigation from './common/Navigation';
import Alerts from './common/Alerts';
import PostList from './posts/PostList';
import PostDetail from './posts/PostDetail';
import Profile from './accounts/Profile';
import ProfileEdit from './accounts/ProfileEdit';
import PostAddForm from './posts/PostAddForm';
import PostEditForm from './posts/PostEditForm';
import Login from './accounts/login';
import Register from './accounts/register';
import PrivateRoute from './accounts/PrivateRoute';
import { loadUser } from '../actions/auth';


const alertOptions = {
  timeout: 3000,
  position: 'top center',
};


class App extends React.Component {
  componentDidMount() {
    store.dispatch(loadUser())
  }

  render() {
    return (
      // Provider component makes store data available to all components inside it
      <Provider store={store}>
        {/* AlertProvider component makes alerts available to all components inside it */}
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Router>
            <Alerts />
            <Navigation />
            {/* bootstrap container */}
            <Container>
              <div className="top">
                <Switch>
                  <Route exact path="/" component={PostList} />
                  <Route exact path="/posts/:id" component={PostDetail} />
                  <PrivateRoute exact path="/profile/edit" component={ProfileEdit} />
                  <Route exact path="/profile/:id" component={Profile} />
                  <PrivateRoute exact path="/post-add" component={PostAddForm} />
                  <PrivateRoute exact path="/post-edit" component={PostEditForm} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/register" component={Register} />
                </Switch>
              </div>
            </Container>
          </Router>
        </AlertProvider>
      </Provider>
    )
  }
}


export default App;
