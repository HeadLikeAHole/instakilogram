import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import { loadProfile, updateProfile } from '../../actions/profile';
import './profile-edit-delete.css';
import PasswordChangeModal from './PasswordChangeModal';
import ProfileDeleteModal from './ProfileDeleteModal';
import ProfileImage from '../common/ProfileImage';


class ProfileEditDelete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      imageFile: '',
      imageUrl: '',
      info: '',
      showPasswordModal: false,
      showDeleteModal: false,
      deletedImageUrl: ''
    };
    this.imgField = React.createRef();
  }

  static propTypes = {
    authUser: PropTypes.object,
    profile: PropTypes.object.isRequired,
    loadProfile: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired
  };

  togglePasswordModal = () => this.setState({showPasswordModal: !this.state.showPasswordModal});

  toggleDeleteModal = () => this.setState({showDeleteModal: !this.state.showDeleteModal});

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
    this.props.updateProfile(this.props.profile.profileData.id, this.state, this.props.history)
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

  deleteProfileImage = () => this.setState({imageFile: '', imageUrl: '', deletedImageUrl: this.state.imageUrl});

  cancelDeleteProfileImage = () => this.setState({imageUrl: this.state.deletedImageUrl, deletedImageUrl: ''});

  componentDidMount() {
    if (Object.keys(this.props.authUser).length) {
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
    const { username, email, first_name, last_name, imageUrl, deletedImageUrl, info } = this.state;
    const { isLoading } = this.props.profile;

    const deleteImgLink = <div className="mt-3 blue-text cursor-pointer" onClick={this.deleteProfileImage}>Удалить фотографию</div>;
    const cancelDeleteImgLink = <div className="mt-3 blue-text cursor-pointer" onClick={this.cancelDeleteProfileImage}>Отменить удаление</div>;
    let linkToDisplay;
    if (!imageUrl.endsWith('profile_default.png') && !isLoading) {
      if(deletedImageUrl) {
        linkToDisplay = cancelDeleteImgLink
      } else {
        linkToDisplay = deleteImgLink
      }
    }

    return (
      <Card className="p-3 mx-auto mt-5 my-container">
        <h2 className="text-center text-uppercase font-italic">Редактировать профиль</h2>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group as={Row} className="align-items-center">
            <Col sm={3}>
              <ProfileImage src={imageUrl} className={`my-2 w-75 text-center ${imageUrl && "cursor-pointer"}`} onClick={() => this.imgField.current.click()} />
            </Col>
            <Col sm={9}>
              <div className="blue-text cursor-pointer" onClick={() => this.imgField.current.click()}>Сменить фотографию</div>
              {linkToDisplay}
            </Col>
            {/* image field */}
            {/* "value = event.target.files[0]" doesn't work on file input field */}
            {/* This field is hidden and clicked by clicking profile picture or link using ref */}
            <Form.Control type="file" name="image" className="d-none" onChange={this.handleChange} ref={this.imgField} />
          </Form.Group>
          {/* login field */}
          <Form.Group as={Row}>
            <Form.Label column sm={3}>Логин:</Form.Label>
            <Col sm={9}>
              <Form.Control type="text" maxLength="30" name="username" value={username} onChange={this.handleChange} />
            </Col>
          </Form.Group>
          {/* email field */}
          <Form.Group as={Row}>
            <Form.Label column sm={3}>Email:</Form.Label>
            <Col sm={9}>
              <Form.Control type="email" maxLength="254" name="email" value={email} onChange={this.handleChange} />
              <span className="below-form-field-text">(Не виден другим пользователям)</span>
            </Col>
          </Form.Group>
          {/* first_name field */}
          <Form.Group as={Row}>
            <Form.Label column sm={3}>Имя:</Form.Label>
            <Col sm={9}>
              <Form.Control type="text" maxLength="30" name="first_name" value={first_name} onChange={this.handleChange} />
            </Col>
          </Form.Group>
          {/* last_name field */}
          <Form.Group as={Row}>
            <Form.Label column sm={3}>Фамилия:</Form.Label>
            <Col sm={9}>
              <Form.Control type="text" maxLength="150" name="last_name" value={last_name} onChange={this.handleChange} />
            </Col>
          </Form.Group>
          {/* info field */}
          <Form.Group as={Row}>
            <Form.Label column sm={3}>О себе:</Form.Label>
            <Col sm={9}>
              <Form.Control as="textarea" rows="5" maxLength="300" name="info" value={info} onChange={this.handleChange} />
            </Col>
          </Form.Group>
          <div className="float-right">
            <div className="my-3 blue-text cursor-pointer" onClick={this.togglePasswordModal}>Сменить пароль</div>
            <div className="mb-5 blue-text cursor-pointer" onClick={this.toggleDeleteModal}>Удалить профиль</div>
          </div>
          <Form.Group className="mt-5 clear">
            <Link to={`/profile/${this.props.profile.profileData.id}`}><Button variant="outline-dark" className="mr-2">Отмена</Button></Link>
            {/* form isn't submitted without type='submit' attribute */}
            <Button type='submit' variant="outline-dark">Сохранить</Button>
          </Form.Group>
        </Form>
        <PasswordChangeModal show={this.state.showPasswordModal} toggleModal={this.togglePasswordModal} />
        <ProfileDeleteModal show={this.state.showDeleteModal} toggleModal={this.toggleDeleteModal} />
      </Card>
    )
  }
}


const mapStateToProps = state => ({
  authUser: state.auth.user,
  profile: state.profile,
});


export default connect(mapStateToProps, { loadProfile, updateProfile })(ProfileEditDelete);
