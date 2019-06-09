import React from 'react';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';

import './post.css';
import NavDropdown from "react-bootstrap/NavDropdown";


const Post = props => {
  return (
    <Card className="card-post mt-5 mb-5">
      <Card.Body className="p-0">
        <Image src="holder.js/171x180" roundedCircle />
        {props.post.user}
        <NavDropdown title="..." id="collasible-nav-dropdown" className="dots mr-1">
          <NavDropdown.Item href="#action/3.1">Edit</NavDropdown.Item>
          <NavDropdown.Item onClick={props.deletePost.bind(this, props.post.id)}>Delete</NavDropdown.Item>
        </NavDropdown>
      </Card.Body>
      <Card.Img variant="top" src={props.post.image} />
      <Card.Body className="p-0">
        <div className="card-post-icons">
          <i className="far fa-heart"></i>
          <i className="far fa-comment"></i>
          <i className="far fa-bookmark"></i>
        </div>
        <div className="post-description">
          {props.post.description}
        </div>
      </Card.Body>
    </Card>
  );
};


export default Post;
