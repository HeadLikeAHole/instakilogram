import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';

import { login } from '../../actions/auth';
import './accounts.css';
import '../posts/post.css';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: '', password: ''}
  }

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
      <Card className="p-3 mx-auto move-down my-container">
        <h2 className="text-center text-uppercase font-italic">Вход на сайт</h2>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Label>Логин:</Form.Label>
            {/* text field */}
            <Form.Control
              type="text"
              maxLength="30"
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
        <Link to="/password-reset"><p>Забыли пароль?</p></Link>
        <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
      </Card>
    )
  }
}


const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});


export default connect(mapStateToProps, { login })(Login);
