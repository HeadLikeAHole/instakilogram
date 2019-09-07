import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
// integration between React Router and React Bootstrap
// makes links behave like bootstrap links when wrapping them
// ordinary Link component breaks bootstrap styling
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './navigation.css';
import SearchBar from './SearchBar';

const Navigation = props => {
  const scrollToTop = () => window.scrollTo(0, 0);

  const { isAuthenticated, user } = props.auth;

  const authenticatedLinks = (
    <Row className="align-items-center">
      <LinkContainer to="/post-add"><i title="Добавить новое фото" className="far fa-plus-square nav-icons cursor-pointer"></i></LinkContainer>
      <LinkContainer to="/all"><i title="Фотографии всех пользователей" className="far fa-images nav-icons cursor-pointer"></i></LinkContainer>
      <div>
        <Link to={`/profile/${user.id}`}><Image src={user.profile_image} roundedCircle className="profile-img cursor-pointer"/></Link>
        <Link to={`/profile/${user.id}`} className="nav-username username-link">{user.username}</Link>
      </div>
    </Row>
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
            <SearchBar />
          </Nav>
          <Nav className="float-lg-right">
            {isAuthenticated ? authenticatedLinks : guestLink}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};


Navigation.propTypes = {
  auth: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
  auth: state.auth
});


export default connect(mapStateToProps)(Navigation);
