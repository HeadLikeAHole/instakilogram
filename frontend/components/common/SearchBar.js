import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

import { loadPostListSearch } from '../../actions/postList';


class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {query: '', disabled: true};
  }

  static propTypes = {
    loadPostListSearch: PropTypes.func.isRequired
  };

  // search button is disabled if query doesn't contain any characters
  toggleDisableAttribute = () => {
    if (this.state.query) {
      this.setState({disabled: false})
    } else {
      this.setState({disabled: true})
    }
  };

  handleChange = event => this.setState({query: event.target.value}, () => this.toggleDisableAttribute());

  handleSubmit = event => {
    event.preventDefault();
    this.props.loadPostListSearch(null, this.state.query, this.props.history);
    this.setState({query: '', disabled: true})
  };

  render() {
    return (
      <Form inline onSubmit={this.handleSubmit}>
        <FormControl
          type="text"
          placeholder="Поиск"
          className="form-control-sm mr-sm-2 mt-4 mt-sm-0 search-color"
          value={this.state.query}
          onChange={this.handleChange}
        />
        {/* class my-3 creates margin top and bottom equal to 3 */}
        <Button
          variant="outline-dark"
          size="sm"
          className="my-3"
          disabled={this.state.disabled}
          onClick={this.handleSubmit}
        >
          Поиск
        </Button>
      </Form>
    )
  }
}


export default connect(null, { loadPostListSearch })(withRouter(SearchBar));
