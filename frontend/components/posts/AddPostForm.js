import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addPost } from '../../actions/posts';


class AddPostForm extends React.Component {
  state = {image: '', description: ''};

  static propTypes = {
    addPost: PropTypes.func.isRequired
  };

  handleChange = event => this.setState({
    // "[event.target.name]" is "computed property name" syntax
    [event.target.name]: event.target.value
  });

  handleSubmit = event => {
    event.preventDefault();
    this.props.addPost(this.state);
    this.setState({image: '', description: ''})
  };

  render() {
    return (
      <Card className="p-3 mt-4 mb-4">
        <h2>Добавьте новое фото</h2>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Label>Фото:</Form.Label>
            {/* image field */}
            <Form.Control
              type="file"
              name="image"
              value={this.state.image}
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


export default connect(null, { addPost })(AddPostForm);