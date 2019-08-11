import React from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// make history available in props
import { withRouter } from 'react-router-dom';

import { deletePost } from '../../actions/postList';
import { toggleModal } from '../../actions/modal';


// dropdown menu with edit and delete links
class PostEditDelete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {show: false};
  }

  static propTypes = {
    post: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    deletePost: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired
  };

  handleToggleModal = () => this.setState({show: !this.state.show});

  handleDelete = () => {
    if (this.props.location.pathname.includes('profile')) {
      this.props.deletePost(this.props.post.id, this.props.toggleModal)
    } else {
      this.props.deletePost(this.props.post.id, this.props.history)
    }
  };

  render() {
    const { id, image, description } = this.props.post;

    return (
      <>
        <NavDropdown alignRight title="..." id="collasible-nav-dropdown" className="dots">
          {/* redirect to post form and send post data along */}
          <LinkContainer to={{
            pathname: "/post-form",
            data: {post: {id, image, description}}
          }}>
            <NavDropdown.Item>Редактировать</NavDropdown.Item>
          </LinkContainer>
          <NavDropdown.Item onClick={this.handleToggleModal}>Удалить</NavDropdown.Item>
        </NavDropdown>

        {/* className="delete-modal" is used PostDetailModal */}
        <Modal show={this.state.show} onHide={this.handleToggleModal} className="delete-modal">
          <Modal.Header closeButton>
            <Modal.Title>Вы уверенны?</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="outline-dark" onClick={this.handleToggleModal}>
              Отмена
            </Button>
            <Button variant="outline-dark" onClick={this.handleDelete}>
              Удалить
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}


export default connect(null, { deletePost, toggleModal })(withRouter(PostEditDelete));
