import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { deleteProfile } from '../../actions/profile';


const ProfileDeleteModal = props => {
  const handleDelete = () => props.deleteProfile(props.history);

  return (
    <Modal centered show={props.show} onHide={props.toggleModal} className="delete-modal">
      <Modal.Header closeButton>
        <Modal.Title>Вы уверенны?</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="outline-dark" onClick={props.toggleModal}>
          Отмена
        </Button>
        <Button variant="outline-danger" onClick={handleDelete}>
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  )
};


ProfileDeleteModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  deleteProfile: PropTypes.func.isRequired
};


export default connect(null, { deleteProfile })(withRouter(ProfileDeleteModal));
