import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { sendNewPassword } from '../../actions/auth';
import { createMessage } from '../../actions/messages';


class PasswordResetConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {password: '', password2: ''}
  }

  static propTypes = {
    sendNewPassword: PropTypes.func.isRequired,
    createMessage: PropTypes.func.isRequired,
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
      this.props.sendNewPassword(this.state.password, this.props.match.params.token, this.props.history);
    }
  };

  render() {
    return (
      <Card className="p-3 mx-auto move-down my-container">
        <h2 className="mb-4 text-center text-uppercase font-italic">Подтверждение смены пароля</h2>
        <p>Пожалуйста введите и подтвердите свой новый пароль.</p>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group className="mb-4">
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
          <Form.Group className="mb-4">
            <Form.Label>Подтвердите пароль:</Form.Label>
            {/* password field */}
            <Form.Control type="password" name="password2" value={this.state.password2} onChange={this.handleChange} />
          </Form.Group>
          <Form.Group>
            {/* form isn't submitted without type='submit' attribute */}
            <Button type='submit' variant="outline-dark">Отправить</Button>
          </Form.Group>
        </Form>
      </Card>
    )
  }
}


export default connect(null, { sendNewPassword, createMessage })(PasswordResetConfirm);
