import React from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// make history available in props
import { withRouter } from 'react-router-dom';

import { deletePost } from '../../actions/postList';


// dropdown menu with edit and delete links
const PostEditDelete = props => {
  const { id, image, description } = props.post;

  const handleClick = () => {
    props.deletePost(id, props.history)
  };

  return (
    <NavDropdown alignRight title="..." id="collasible-nav-dropdown" className="dots">
      {/* redirect to post form and send post data along */}
      <LinkContainer to={{
        pathname: "/post-form",
        data: {post: {id: id, image: image, description: description}}
      }}>
        <NavDropdown.Item>Редактировать</NavDropdown.Item>
      </LinkContainer>
      <NavDropdown.Item onClick={handleClick}>Удалить</NavDropdown.Item>
    </NavDropdown>
  )
};


PostEditDelete.propTypes = {
  post: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired
};


export default connect(null, { deletePost })(withRouter(PostEditDelete));
