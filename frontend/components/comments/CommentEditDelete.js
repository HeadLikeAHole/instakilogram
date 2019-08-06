import React from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addCommentFormInfo } from '../../actions/commentFormInfo';
import { deleteComment } from '../../actions/commentList';
import './comment-edit-delete.css';


// dropdown menu with edit and delete links
const CommentEditDelete = props => {
  const handleEdit = () => {
    props.addCommentFormInfo({
      comment_id: props.comment.id,
      parent_id: props.comment.parent,
      text: props.comment.text
    })
  };

  // delete comment or reply
  const handleDelete = () => props.deleteComment(props.comment.id, props.comment.parent);

  return (
    <NavDropdown alignRight title="..." id="collasible-nav-dropdown" className={`small-dots ${props.visible && 'visible'}`}>
      <NavDropdown.Item onClick={handleEdit}>Редактировать</NavDropdown.Item>
      <NavDropdown.Item onClick={handleDelete}>Удалить</NavDropdown.Item>
    </NavDropdown>
  )
};


CommentEditDelete.propTypes = {
  comment: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  addCommentFormInfo: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired
};


export default connect(null, { addCommentFormInfo, deleteComment })(CommentEditDelete);
