import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import { loadProfile, updateProfile } from '../../actions/profile';
import './profile-edit.css';


class ProfileEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '', email: '', first_name: '', last_name: '', imageFile: '', imageUrl: '', info: ''
    }
  }

  static propTypes = {
    authUser: PropTypes.object,
    profile: PropTypes.object.isRequired,
    loadProfile: PropTypes.func.isRequired,
  };

  handleChange = event => {
    if (event.target.name === 'image') {
      const imageFile = event.target.files[0];
      const imageUrl = URL.createObjectURL(imageFile);
      this.setState({imageFile: imageFile, imageUrl: imageUrl})
    } else {
      this.setState({[event.target.name]: event.target.value});
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    // send profile id, post state and history method to update function
    this.props.updateProfile(this.props.profile.id, this.state, this.props.history)
  };

  prefillForm = profile => {
    // extract filename from url
    const fileName = profile.image.split('/').pop();
    // fetch image file
    fetch(profile.image)
      .then(response => response.blob())
      .then(file => {
        const imageFile = new File([file], fileName);
        // fill fields with existing user profile data
        this.setState({
          username: profile.user.username,
          email: profile.user.email,
          first_name: profile.user.first_name,
          last_name: profile.user.last_name,
          imageFile: imageFile,
          imageUrl: profile.image,
          info: profile.info})
      });
  };

  componentDidMount() {
    if (this.props.authUser) {
      this.props.loadProfile(this.props.authUser.id, this.prefillForm);
    }
  }

  // wait for authUser to load and fill the form on page refresh
  // without it authUser doesn't have time to load on page refresh
  // and this.props.loadProfile() is executed with this.props.authUser.id argument which equals null
  componentDidUpdate(prevProps) {
    if (this.props.authUser !== prevProps.authUser) {
      this.props.loadProfile(this.props.authUser.id, this.prefillForm);
    }
  }

  render() {
    const { username, email, first_name, last_name, imageUrl, info } = this.state;

    return (
      <Card className="p-3 mx-auto mt-5 my-container">
        <h2 className="text-center text-uppercase font-italic">Редактировать профиль</h2>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Image src={imageUrl} roundedCircle className="my-2 profile-edit-img" />
            {/* image field */}
            {/* "value = event.target.files[0]" doesn't work on file input field */}
            <Form.Control type="file" name="image" onChange={this.handleChange} />
          </Form.Group>
          {/* login field */}
          <Form.Group as={Row}>
            <Form.Label column sm={3}>Логин:</Form.Label>
            <Col sm={9}>
              <Form.Control type="text" name="username" value={username} onChange={this.handleChange} />
            </Col>
          </Form.Group>
          {/* email field */}
          <Form.Group as={Row}>
            <Form.Label column sm={3}>Email:</Form.Label>
            <Col sm={9}>
              <Form.Control type="email" name="email" value={email} onChange={this.handleChange} />
            </Col>
          </Form.Group>
          {/* first_name field */}
          <Form.Group as={Row}>
            <Form.Label column sm={3}>Имя:</Form.Label>
            <Col sm={9}>
              <Form.Control type="text" name="first_name" value={first_name} onChange={this.handleChange} />
            </Col>
          </Form.Group>
          {/* last_name field */}
          <Form.Group as={Row}>
            <Form.Label column sm={3}>Фамилия:</Form.Label>
            <Col sm={9}>
              <Form.Control type="text" name="last_name" value={last_name} onChange={this.handleChange} />
            </Col>
          </Form.Group>
          {/* info field */}
          <Form.Group as={Row}>
            <Form.Label column sm={3}>О себе:</Form.Label>
            <Col sm={9}>
              <Form.Control as="textarea" rows="5" name="info" value={info} onChange={this.handleChange} />
            </Col>
          </Form.Group>
          <Form.Group className="mt-2">
            {/* form isn't submitted without type='submit' attribute */}
            <Button type='submit' variant="outline-dark" className="mr-2">Сохранить</Button>
            <Link to={`/profile/${this.props.profile.id}`}><Button variant="outline-dark">Отмена</Button></Link>
          </Form.Group>
        </Form>
      </Card>
    )
  }
}


const mapStateToProps = state => ({
  authUser: state.auth.user,
  profile: state.profile,
});


export default connect(mapStateToProps, { loadProfile, updateProfile })(ProfileEdit);
