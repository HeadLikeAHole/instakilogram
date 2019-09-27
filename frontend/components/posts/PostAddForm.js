import React from 'react';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { addPost } from '../../actions/postList';
import './post.css';


class PostAddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageFile: '', imageUrl: '', description: '', disabled: true
    };
    this.imageField = React.createRef();
  }

  static propTypes = {
    addPost: PropTypes.func.isRequired
  };

  // "Сохранить" button is disabled if image field and textarea are empty
  toggleDisableAttribute = () => {
    if (this.state.imageFile && this.state.description) {
      this.setState({disabled: false})
    } else {
      this.setState({disabled: true})
    }
  };


  handleChange = event => {
    if (event.target.name === 'image') {
      const imageFile = event.target.files[0];
      const imageUrl = URL.createObjectURL(imageFile);
      this.setState({imageFile: imageFile, imageUrl: imageUrl}, () => this.toggleDisableAttribute())
    } else {
      this.setState({description: event.target.value}, () => this.toggleDisableAttribute());
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.addPost(this.state, this.props.history);
    this.setState({imageFile: '', imageUrl: '', description: ''});
    // since state's image property contains file object not file name
    // use ref to remove image filename from file field on successful form submission
    this.imageField.current.value = '';
  };

  render() {
    return (
      <Card className="p-3 mx-auto mt-5 my-container">
        <h2 className="text-center text-uppercase font-italic">Добавить новое фото</h2>
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
            <Form.Control as="textarea" rows="3" maxLength="300" name="description" value={this.state.description} onChange={this.handleChange} />
          </Form.Group>
          <Form.Group>
            {/* form isn't submitted without type='submit' attribute */}
            <Link to="/"><Button variant="outline-dark" className="mr-2">Отмена</Button></Link>
            <Button type="submit" variant="outline-dark" disabled={this.state.disabled}>Сохранить</Button>
          </Form.Group>
        </Form>
      </Card>
    )
  }
}


export default connect(null, { addPost })(PostAddForm);
