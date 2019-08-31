import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { changePassword } from '../../actions/profile';


class PasswordChangeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '', newPassword: '', confirmNewPassword: ''
    }
  }

  static propTypes = {
    show: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired
  };

  handleChange = event => this.setState({
    // "[event.target.name]" is "computed property name" syntax
    [event.target.name]: event.target.value
  });

  handleSubmit = event => {
    event.preventDefault();
    this.props.changePassword(this.state, this.props.toggleModal);
    this.setState({oldPassword: '', newPassword: '', confirmNewPassword: ''})
  };

  handleCancel = () => {
    this.props.toggleModal();
    this.setState({oldPassword: '', newPassword: '', confirmNewPassword: ''})
  };

  render() {
    return (
      <Modal centered show={this.props.show} onHide={this.props.toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Сменить пароль</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Label>Старый пароль:</Form.Label>
              {/* old password field */}
              <Form.Control type="password" name="oldPassword" value={this.state.oldPassword} onChange={this.handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Новый пароль:</Form.Label>
              {/* new password field */}
              <Form.Control type="password" name="newPassword" value={this.state.newPassword} onChange={this.handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Подтвердите новый пароль:</Form.Label>
              {/* confirm new password field */}
              <Form.Control type="password" name="confirmNewPassword" value={this.state.confirmNewPassword} onChange={this.handleChange} />
            </Form.Group>
            <Form.Group>
              <Button variant="outline-dark" className="mr-2" onClick={this.handleCancel}>
                Отмена
              </Button>
              <Button type='submit' variant="outline-dark">
                Сохранить
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    )
  }
}


export default connect(null, { changePassword })(PasswordChangeModal);
