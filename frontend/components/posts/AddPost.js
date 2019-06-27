import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addPost } from '../../actions/postList';


class AddPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '', description: ''
    };
    this.imageField = React.createRef();
  }

  static propTypes = {
    addPost: PropTypes.func.isRequired
  };

  handleChange = event => {
    let value;
    if (event.target.name === 'image') {
      value = event.target.files[0];
    } else {
      value = event.target.value;
    }
    this.setState({[event.target.name]: value});
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.addPost(this.state);
    this.setState({image: '', description: ''});
    // since state's image property contains file object not file name
    // use ref to remove image filename from file field on successful form submission
    this.imageField.current.value = '';
  };

  render() {
    return (
      <Card className="p-3 mt-4 mb-4">
        <h2>Добавьте новое фото</h2>
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
            <Button type='submit' variant="outline-dark">Сохранить</Button>
          </Form.Group>
        </Form>
      </Card>
    )
  }
}


export default connect(null, { addPost })(AddPost);