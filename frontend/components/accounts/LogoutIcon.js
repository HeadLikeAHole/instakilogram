import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { logout } from '../../actions/auth';


class LogoutIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {show: false};
  }

  static propTypes = {
    logout: PropTypes.func.isRequired
  };

  toggleModal = () => this.setState({show: !this.state.show});

  render() {
    return (
      <>
        {/* logout icon */}
        <i
          title="Выйти из аккаунта"
          className="fas fa-sign-out-alt ml-3 cursor-pointer logout-icon"
          onClick={this.toggleModal}>
        </i>

        {/* logout confirmation modal */}
        <Modal show={this.state.show} onHide={this.toggleModal}>
          <Modal.Header closeButton>
            <Modal.Title>Вы уверенны, что хотите выйти из аккаунта?</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="outline-dark" onClick={this.toggleModal}>
              Отмена
            </Button>
            {/* pass in history props to logout function in order to redirect to home page after successful logging out */}
            <Button variant="outline-dark" onClick={() => this.props.logout(this.props.history)}>
              Выйти
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}


export default connect(null, { logout })(withRouter(LogoutIcon));
