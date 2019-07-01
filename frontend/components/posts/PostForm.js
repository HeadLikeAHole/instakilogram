import React from 'react';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { addPost, updatePost } from '../../actions/postList';

import './post.css';


class PostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageFile: '', imageUrl: '', description: ''
    };
    this.imageField = React.createRef();
  }

  static propTypes = {
    addPost: PropTypes.func.isRequired,
    updatePost: PropTypes.func.isRequired
  };

  handleChange = event => {
    if (event.target.name === 'image') {
      const imageFile = event.target.files[0];
      const imageUrl = URL.createObjectURL(imageFile);
      this.setState({imageFile: imageFile, imageUrl: imageUrl})
    } else {
      this.setState({description: event.target.value});
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.props.location.data) {
      // send post id, post state and history method to update function
      this.props.updatePost(this.props.location.data.post.id, this.state, this.props.history);
    } else {
      this.props.addPost(this.state, this.props.history);
    }
    this.setState({imageFile: '', imageUrl: '', description: ''});
    // since state's image property contains file object not file name
    // use ref to remove image filename from file field on successful form submission
    this.imageField.current.value = '';
  };

  componentDidMount() {
    // check if post data was sent through <Link> element
    if (this.props.location.data) {
      const { image, description } = this.props.location.data.post;
      // extract filename from url
      const fileName = image.split('/').pop();
      // fetch image file
      fetch(image)
        .then(response => response.blob())
        .then(file => {
          const imageFile = new File([file], fileName);
          this.setState({imageFile: imageFile, imageUrl: image, description: description})
        });
    }
  }

  render() {
    let header;
    if (this.props.location.data) {
      header = "Редактировать фото";
    } else {
      header = "Добавить новое фото";
    }

    return (
      <Card className="p-3 mx-auto mt-5 my-container">
        <h2 className="text-center text-uppercase font-italic">{header}</h2>
        {/* preview image */}
        <Image src={this.state.imageUrl} rounded className="my-2 w-100" />
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Label>Фото:</Form.Label>
            {/* image field */}
            {/* "value = event.target.files[0]" doesn't work on file input field */}
            <Form.Control
              type="file"
              name="image"
              ref={this.imageField}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Описание:</Form.Label>
            {/* textarea */}
            <Form.Control
              as="textarea"
              rows="3"
              name="description"
              value={this.state.description}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group>
            {/* form isn't submitted without type='submit' attribute */}
            <Button type='submit' variant="outline-dark" className="mr-2">Сохранить</Button>
            <Link to="/"><Button variant="outline-dark">Отмена</Button></Link>
          </Form.Group>
        </Form>
      </Card>
    )
  }
}


export default connect(null, { addPost, updatePost })(PostForm);
