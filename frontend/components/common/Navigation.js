import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
// integration between React Router and React Bootstrap
// makes links behave like bootstrap links when wrapping them
// ordinary Link component breaks bootstrap styling
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './navigation.css';
import SearchBar from './SearchBar';
import ProfileImage from './ProfileImage';


const Navigation = props => {
  const scrollToTop = () => window.scrollTo(0, 0);

  const { isAuthenticated, isLoading, user } = props.auth;

  // check if user object has loaded
  let userLoaded = false;
  if (Object.keys(user).length > 0) {
    userLoaded = true
  }

  const authenticatedLinks = (
    <Row noGutters={true} className="justify-content-between justify-content-sm-start align-items-center">
      <LinkContainer to="/post-add">
        <i title="Добавить новое фото" className="far fa-plus-square nav-icons cursor-pointer"></i>
      </LinkContainer>
      <LinkContainer to="/all">
        <i title="Фотографии всех пользователей" className="far fa-images nav-icons cursor-pointer"></i>
      </LinkContainer>
      <Row noGutters={true} className="align-items-center">
        <Link to={`/profile/${userLoaded && user.id}`}>
          <ProfileImage src={user.profile_image} className="profile-img cursor-pointer"/>
        </Link>
        <Link to={`/profile/${userLoaded && user.id}`} title={userLoaded && user.username} className="truncate-username nav-username username-link">
          {userLoaded && user.username}
        </Link>
      </Row>
    </Row>
  );

  // hide link while loading user
  const guestLink = () => isLoading ? <Spinner animation="grow" /> : <Link to="/login">Войти</Link>;

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
            {isAuthenticated ? authenticatedLinks : guestLink()}
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
