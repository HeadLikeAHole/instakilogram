import React from 'react';
import { Provider } from 'react-redux';
import Container from 'react-bootstrap/Container';
// make alerts available in the whole app
// use alias because there is already a Provider component
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic'

import './app.css';
import store from '../store';
import Navigation from './layout/Navigation';
import Alerts from './layout/Alerts';
import Posts from './posts/Posts';
import AddPostForm from './posts/AddPostForm';


const alertOptions = {
  timeout: 3000,
  position: 'top center',
};


class App extends React.Component {
  render() {
    return (
      // Provider component makes store data available to all components inside it
      <Provider store={store}>
        {/* AlertProvider component makes alerts available to all components inside it */}
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Alerts />
          <Navigation />
          {/* bootstrap container */}
          <Container>
            <div className="margin">
              <AddPostForm />
              <Posts />
            </div>
          </Container>
        </AlertProvider>
      </Provider>
    )
  }
}


export default App;