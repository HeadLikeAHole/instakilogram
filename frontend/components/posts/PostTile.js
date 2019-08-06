import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Col from 'react-bootstrap/Col';

import PostHover from './PostHover';
import './post-tile.css';
import { currentPostId } from '../../actions/postSlider';
import { toggleModal } from '../../actions/modal';


// post thumbnail in profile page
class PostTile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {mode: '', postHover: false};
    this.imgElement = React.createRef();
  }

  static propTypes = {
    post: PropTypes.object.isRequired,
    currentPostId: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired
  };

  // find out what mode the image in (landscape or portrait)
  // to apply appropriate css class
  landscapeOrPortrait = () => {
    const width = this.imgElement.current.naturalWidth;
    const height = this.imgElement.current.naturalHeight;
    if (width > height) {
      this.setState({mode: 'landscape'})
    } else {
      this.setState({mode: 'portrait'})
    }
  };

  handleHover = () => {
    this.setState({postHover: !this.state.postHover})
  };

  handleClick = () => {
    this.props.currentPostId(this.props.post.id);
    this.props.toggleModal()
  };

  componentDidMount() {
    this.landscapeOrPortrait();
  }

  render() {
    return (
      <Col sm={6} md={4} className="my-3">
        <div
          className="square"
          onMouseEnter={this.handleHover}
          onMouseLeave={this.handleHover}
          onClick={this.handleClick}
        >
          <img src={this.props.post.image} className={`${this.state.mode}`} ref={this.imgElement} />
          {this.state.postHover && <PostHover />}
        </div>
      </Col>
    );
  }
}


export default connect(null, { currentPostId, toggleModal })(PostTile);
