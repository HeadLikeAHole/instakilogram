import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import { sendEmailAddress } from '../../actions/auth';


class PasswordReset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {email: '', show: false}
  }

  static propTypes = {
    sendEmailAddress: PropTypes.func.isRequired
  };

  handleChange = event => this.setState({email: event.target.value});

  handleSubmit = event => {
    event.preventDefault();
    this.props.sendEmailAddress(this.state.email, this.toggleModal);
    this.setState({email: ''})
  };

  toggleModal = () => this.setState({show: !this.state.show});

  render() {
    return (
      <Card className="p-3 mx-auto move-down my-container">
        <h2 className="mb-3 text-center text-uppercase font-italic">восстановление пароля</h2>
        <p className="my-4">Забыли свой пароль? Введите адрес своей элетронной почты и мы отправим вам на него инструкцию для установки нового пароля.</p>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Label>Адрес электронной почты:</Form.Label>
            {/* text field */}
            <Form.Control
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group>
            {/* form isn't submitted without type='submit' attribute */}
            <Button type='submit' variant="outline-dark">Отправить</Button>
          </Form.Group>
        </Form>

        <Modal size="lg" centered show={this.state.show} onHide={this.toggleModal}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Восстановление пароля
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Мы отправили вам электронное письмо с иструкцией как восстановить пароль.
              Если оно не пришло в течении нескольких минут посмотрите в папке со спамом.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.toggleModal}>Закрыть</Button>
          </Modal.Footer>
        </Modal>
    </Card>
    )
  }
}


export default connect(null, { sendEmailAddress })(PasswordReset);
