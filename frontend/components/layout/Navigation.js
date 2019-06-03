import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';


import './navigation.css';


const Navigation = ()=> {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#" className='logo'>
        {/* "i" tag is a font awesome camera */}
        Instakilogram <i className="fas fa-camera-retro"></i>
      </Navbar.Brand>
      {/* burgerize is the id of the element to collapse on shrinking */}
      <Navbar.Toggle aria-controls="burgerize" />
      <Navbar.Collapse id="burgerize" className="float-right">
        <Nav className="mr-auto">
          <Nav.Link href="#features">Features</Nav.Link>
          <Nav.Link href="#pricing">Pricing</Nav.Link>
        </Nav>
        <Nav>
          <Image src="holder.js/171x180" roundedCircle />
          <NavDropdown title="Igor" id="collasible-nav-dropdown" className="mr-1">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
          </NavDropdown>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-dark">Search</Button>
          </Form>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    )
};


export default Navigation;
