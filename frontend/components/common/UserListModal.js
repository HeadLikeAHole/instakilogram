import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner'

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
    // url in loadUserList function depends on title
    title: PropTypes.string,
    toggleModal: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    page: PropTypes.string,
    loadUserList: PropTypes.func.isRequired,
    userList: PropTypes.object.isRequired,
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
    const { show, title, toggleModal, page } = this.props;
    const { isLoading, users } = this.props.userList;

    return (
      <Modal centered show={show} onHide={toggleModal} className="user-list-modal"> {/* className="user-list-modal" is used in PostDetailModal */}
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="user-modal" onScroll={this.handleScroll} ref={this.userModal}>
          <UserList users={users} page={page} />
          {isLoading && <div className="w-100 text-center"><Spinner animation="grow" className="comment-spinner" /></div>}
        </Modal.Body>
      </Modal>
    )
  }
}


const mapStateToProps = state => ({
  userList: state.userList
});


export default connect(mapStateToProps, { loadUserList, removeUserList })(UserListModal);
