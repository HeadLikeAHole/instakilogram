import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';

import { register } from '../../actions/auth';
import { createMessage } from '../../actions/messages';
import '../posts/post.css';


class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: '', email: '', password: '', password2: ''}
  }

  static propTypes = {
    register: PropTypes.func.isRequired,
    createMessage: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  };

  handleChange = event => this.setState({
    // "[event.target.name]" is "computed property name" syntax
    [event.target.name]: event.target.value
  });

  handleSubmit = event => {
    event.preventDefault();
    if (this.state.password !== this.state.password2) {
      this.props.createMessage({ passwordsNotMatch: 'Пароли не совпадают' });
    } else {
      this.props.register(this.state);
      this.setState({username: '', email: '', password: '', password2: ''})
    }
  };

  render() {
    // redirect to home page after logging in
    // which is done automatically on registering
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />
    }

    return (
      <Card className="p-3 mx-auto move-down my-container">
        <h2 className="text-center text-uppercase font-italic">Регистрация</h2>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Label>Логин:</Form.Label>
            {/* text field */}
            <Form.Control type="text" maxLength="30" name="username" value={this.state.username} onChange={this.handleChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>E-mail:</Form.Label>
            {/* text field */}
            <Form.Control type="email" maxLength="254" name="email" value={this.state.email} onChange={this.handleChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Пароль:</Form.Label>
            {/* password field */}
            <Form.Control type="password" name="password" value={this.state.password} onChange={this.handleChange} />
            <ul className="ml-3 below-form-field-text">
              <li>Ваш пароль не должен быть слишком похожим на другую вашу личную информацию</li>
              <li>Ваш пароль должен содержать не менее 8 символов</li>
              <li>Ваш пароль не должен быть одним из часто используемых ("12345678", "password" и т.д.)</li>
              <li>Ваш пароль не должен состоять полностью из цифр</li>
            </ul>
          </Form.Group>
          <Form.Group>
            <Form.Label>Подтвердите пароль:</Form.Label>
            {/* password field */}
            <Form.Control type="password" name="password2" value={this.state.password2} onChange={this.handleChange} />
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
