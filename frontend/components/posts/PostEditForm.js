import React from 'react';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { updatePost } from '../../actions/postList';
import './post.css';


class PostEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageFile: '', imageUrl: '', description: ''
    };
    this.imageField = React.createRef();
  }

  static propTypes = {
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
    this.props.updatePost(JSON.parse(localStorage.getItem('post')).id, this.state, this.props.history);
    this.setState({imageFile: '', imageUrl: '', description: ''});
    // since state's image property contains file object not file name
    // use ref to remove image filename from file field on successful form submission
    this.imageField.current.value = '';
  };

  prefillForm = () => {
    const retrievedPost = JSON.parse(localStorage.getItem('post'));
    const { image, description } = retrievedPost;
    // extract filename from url
    const fileName = image.split('/').pop();
    // fetch image file and set state
    fetch(image)
      .then(response => response.blob())
      .then(file => {
        const imageFile = new File([file], fileName);
        this.setState({imageFile: imageFile, imageUrl: image, description: description})
      });
  };

  componentDidMount() {
    // check if post data was sent through <Link> element
    if (this.props.location.post) {
      // save post to local storage so field data persist on page refresh
      const post = this.props.location.post;
      localStorage.setItem('post', JSON.stringify(post));
      this.prefillForm()
    } else {
      this.prefillForm()
    }
  }

  componentWillUnmount() {
    localStorage.removeItem('post')
  }

  render() {
    return (
      <Card className="p-3 mx-auto mt-5 my-container">
        <h2 className="text-center text-uppercase font-italic">Редактировать фото</h2>
        {/* preview image */}
        <Image src={this.state.imageUrl} rounded className="my-2 w-100" />
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Label>Фото:</Form.Label>
            {/* image field */}
            {/* "value = event.target.files[0]" doesn't work on file input field */}
            <Form.Control type="file" name="image" ref={this.imageField} onChange={this.handleChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Описание:</Form.Label>
            {/* textarea */}
            <Form.Control as="textarea" rows="3" name="description" value={this.state.description} onChange={this.handleChange} />
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


export default connect(null, { updatePost })(PostEditForm);
