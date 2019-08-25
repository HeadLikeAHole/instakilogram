import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';

import UserList from './UserList';
import { loadUserList, removeUserList } from '../../actions/userList';
import './user-list-modal.css';


// Modal for followers, following and liked by
class UserListModal extends React.Component {
  constructor(props) {
    super(props);
    this.userModal = React.createRef();
  }

  static propTypes = {
    show: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    title: PropTypes.string,
    id: PropTypes.number.isRequired,
    loadUserList: PropTypes.func.isRequired,
    userList: PropTypes.object.isRequired,
    page: PropTypes.string
  };

  // infinite scroll inside modal
  handleScroll = () => {
    const { isLoading, next } = this.props.userList;
      if (isLoading || !next) return;
      if (
        this.userModal.current.scrollHeight -
        this.userModal.current.scrollTop ===
        this.userModal.current.clientHeight
      ) {
        this.props.loadUserList(this.props.title, this.props.id, next);
      }
  };

  componentDidUpdate(prevProps) {
    if (this.props.show && !prevProps.show) {
      this.props.loadUserList(this.props.title, this.props.id);
    }
    if (!this.props.show && prevProps.show) {
      this.props.removeUserList();
    }
  }

  render() {
    const { show, toggleModal, title, userList } = this.props;

    return (
      <Modal centered show={show} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="user-modal" onScroll={this.handleScroll} ref={this.userModal}>
          <UserList users={userList.users} page={this.props.page} />
        </Modal.Body>
      </Modal>
    )
  }
}


const mapStateToProps = state => ({
  userList: state.userList
});



export default connect(mapStateToProps, { loadUserList, removeUserList })(UserListModal);
