import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';

import { login } from '../../actions/auth';
import './accounts.css';


class Login extends React.Component {
  state = {
    username: '',
    password: ''
  };

  static propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  };

  handleChange = event => this.setState({
    // "[event.target.name]" is "computed property name" syntax
    [event.target.name]: event.target.value
  });

  handleSubmit = event => {
    event.preventDefault();
    this.props.login(this.state.username, this.state.password);
  };

  render() {
    // redirect to home page after logging in
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />
    }

    return (
      <Card className="p-3 move-down">
        <h2>Вход на сайт</h2>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Label>Логин:</Form.Label>
            {/* text field */}
            <Form.Control
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Пароль:</Form.Label>
            {/* password field */}
            <Form.Control
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group>
            {/* form isn't submitted without type='submit' attribute */}
            <Button type='submit' variant="outline-dark">Вход</Button>
          </Form.Group>
        </Form>
        <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
      </Card>
    )
  }
}


const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});


export default connect(mapStateToProps, { login })(Login);