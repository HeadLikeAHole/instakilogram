import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import NavDropdown from "react-bootstrap/NavDropdown";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import './post.css';


const Post = props => {
  const { authUser } = props;
  // user variable is post author's user's id
  const { id, username, profile_image, image, description, user } = props.post;

  let authorized = false;

  // check if post author is current logged in user
  if (authUser) {
    if (authUser.id === user) {
      authorized = true
    }
  }

  // dropdown menu with edit and delete links
  const editDelete = (
    <NavDropdown alignRight title="..." id="collasible-nav-dropdown" className="mr-1 dots">
      {/* redirect to post form and send post data along */}
      <LinkContainer to={{
        pathname: "/post-form",
        data: {post: {id: id, image: image, description: description}}
      }}>
        <NavDropdown.Item href="">Редактировать</NavDropdown.Item>
      </LinkContainer>
      <NavDropdown.Item onClick={props.deletePost.bind(this, id)}>Удалить</NavDropdown.Item>
    </NavDropdown>
  );

  return (
    <Card className="mx-auto my-5 my-container">
      <Card.Body className="p-3">
        <Row>
          <Col>
            {/* user's profile picture and username are wrapped in links where {user} is user's id which is the same as user's profile id */}
            <Link to={`/profile/${user}`}><Image src={profile_image} roundedCircle className="mr-2 post-profile-img" /></Link>
            <Link to={`/profile/${user}`} className="post-username-link">{username}</Link>
            {/* if user is owner of the post display dropdown menu */}
            {authorized && editDelete}
          </Col>
        </Row>
      </Card.Body>
      <Card.Img variant="top" src={image} />
      <Card.Body className="p-3">
        <div className="my-1">
          <i className="far fa-heart my-icon"></i>
          <Link to={`/posts/${id}`}><i className="far fa-comment my-icon"></i></Link>
          <i className="far fa-bookmark my-icon"></i>
        </div>
        {description}
      </Card.Body>
    </Card>
  );
};


Post.propTypes = {
  authUser: PropTypes.object
};


// make state available to Post component though props
const mapStateToProps = state => ({
  authUser: state.auth.user
});


export default connect(mapStateToProps)(Post);