import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';

import { register } from '../../actions/auth';
import { createMessage } from '../../actions/messages';


class Register extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    password2: ''
  };

  static propTypes = {
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  };

  handleChange = event => this.setState({
    // "[event.target.name]" is "computed property name" syntax
    [event.target.name]: event.target.value
  });

  handleSubmit = event => {
    event.preventDefault();
    if (this.state.password !== this.state.password2) {
      this.props.createMessage({ passwordsNotMatch: 'Пароли не совпадают' })
    }
    this.props.register(this.state);
    this.setState({username: '', email: '', password: '', password2: ''})
  };

  render() {
    // redirect to home page after logging in
    // which is done automatically on registering
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />
    }

    return (
      <Card className="p-3 move-down">
        <h2>Регистрация</h2>
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
            <Form.Label>E-mail:</Form.Label>
            {/* text field */}
            <Form.Control
              type="text"
              name="email"
              value={this.state.email}
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
            <Form.Label>Подтвердите пароль:</Form.Label>
            {/* password field */}
            <Form.Control
              type="password"
              name="password2"
              value={this.state.password2}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group>
            {/* form isn't submitted without type='submit' attribute */}
            <Button type='submit' variant="outline-dark">Зарегистрироваться</Button>
          </Form.Group>
        </Form>
        <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
      </Card>
    )
  }
}


const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});


export default connect(mapStateToProps, { register, createMessage })(Register);
