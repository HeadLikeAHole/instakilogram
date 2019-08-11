import React from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { addCommentFormInfo } from '../../actions/commentFormInfo';
import { deleteComment } from '../../actions/commentList';
import './comment-edit-delete.css';


// dropdown menu with edit and delete links
class CommentEditDelete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {show: false};
  }

  static propTypes = {
    comment: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    addCommentFormInfo: PropTypes.func.isRequired,
    deleteComment: PropTypes.func.isRequired
  };

  handleToggleModal = () => this.setState({show: !this.state.show});

  handleEdit = () => {
    this.props.addCommentFormInfo({
      comment_id: this.props.comment.id,
      parent_id: this.props.comment.parent,
      text: this.props.comment.text
    })
  };

  // delete comment or reply
  handleDelete = () => this.props.deleteComment(this.props.comment.id, this.props.comment.parent);

  render() {
    return (
      <>
        <NavDropdown alignRight title="..." id="collasible-nav-dropdown" className={`small-dots ${this.props.visible && 'visible'}`}>
          <NavDropdown.Item onClick={this.handleEdit}>Редактировать</NavDropdown.Item>
          <NavDropdown.Item onClick={this.handleToggleModal}>Удалить</NavDropdown.Item>
        </NavDropdown>

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


export default connect(null, { addCommentFormInfo, deleteComment })(CommentEditDelete);
