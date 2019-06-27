import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import NavDropdown from "react-bootstrap/NavDropdown";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './post.css';


const Post = props => {
  let authorized = false;

  // dropdown menu with edit and delete links
  const editDelete = (
    <NavDropdown alignRight title="..." id="collasible-nav-dropdown" className="mr-1 dots">
      <NavDropdown.Item href="#action/3.1">Редактировать</NavDropdown.Item>
      <NavDropdown.Item onClick={props.deletePost.bind(this, props.post.id)}>Удалить</NavDropdown.Item>
    </NavDropdown>
  );

  // check if post creator is current logged in user
  if (props.user) {
    if (props.post.user === props.user.id) {
      authorized = true
    }
  }

  return (
    <Card className="mx-auto my-5 card-post">
      <Card.Body className="p-3">
        <Row>
          <Col>
            <Image src={props.post.profile_image} roundedCircle className="mr-2 post-profile-img" />
            {props.post.username}
            {/* if user is owner of the post display dropdown menu */}
            {authorized && editDelete}
          </Col>
        </Row>
      </Card.Body>
      <Card.Img variant="top" src={props.post.image} />
      <Card.Body className="p-3">
        <div className="my-1">
          <i className="far fa-heart my-icon"></i>
          <Link to={`/posts/${props.post.id}`}><i className="far fa-comment my-icon"></i></Link>
          <i className="far fa-bookmark my-icon"></i>
        </div>
        <div className="">
          {props.post.description}
        </div>
      </Card.Body>
    </Card>
  );
};


Post.propTypes = {
  user: PropTypes.object
};


// make state available to Post component though props
const mapStateToProps = state => ({
  user: state.auth.user
});


export default connect(mapStateToProps)(Post);
