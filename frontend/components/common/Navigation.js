import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
// integration between React Router and React Bootstrap
// makes links behave like bootstrap links when wrapping them
// ordinary Link component breaks bootstrap styling
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './navigation.css';
import { logout } from '../../actions/auth';


const Navigation = props => {
  const scrollToTop = () => window.scrollTo(0, 0);

  const { isAuthenticated, user } = props.auth;

  const authenticatedLinks = (
    <NavDropdown alignRight title={user && user.username} id="collasible-nav-dropdown" className="mr-1">
      <LinkContainer to="/post-add">
        <NavDropdown.Item>Добавить фото</NavDropdown.Item>
      </LinkContainer>
      <LinkContainer to={`/profile/${user && user.id}`}><NavDropdown.Item>Профиль</NavDropdown.Item></LinkContainer>
      <NavDropdown.Item onClick={props.logout}>Выйти</NavDropdown.Item>
    </NavDropdown>
  );

  const guestLink = <Link to="/login">Войти</Link>;

  return (
    <Navbar fixed="top" expand="lg" className="custom-nav">
      {/* Container is used here to move all links closer together (white background spans whole page) */}
      <Container>
        {/* website logo */}
        <LinkContainer to="/" onClick={scrollToTop}>
          <Navbar.Brand href="#" className='logo'>
            {/* "i" tag is a font awesome camera */}
            Instakilogram <i className="fas fa-camera-retro"></i>
          </Navbar.Brand>
        </LinkContainer>

        {/* burgerize is the id of the element to collapse on shrinking */}
        <Navbar.Toggle aria-controls="burgerize" />
        <Navbar.Collapse id="burgerize" className="float-right">
          <Nav className="mx-auto">
            <Form inline>
              <FormControl type="text" placeholder="Поиск" className="form-control-sm mr-sm-2 search-color" />
              {/* class my-3 creates margin top and bottom equal to 3 */}
              <Button variant="outline-dark" size="sm" className="my-3">Поиск</Button>
            </Form>
          </Nav>
          <Nav className="float-lg-right">
            {/* if user is logged-in display profile image */}
            <Image src={user && user.profile_image} roundedCircle className="profile-img" />
            {isAuthenticated ? authenticatedLinks : guestLink}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};


Navigation.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};


const mapStateToProps = state => ({
  auth: state.auth
});


export default connect(mapStateToProps, { logout })(Navigation);
