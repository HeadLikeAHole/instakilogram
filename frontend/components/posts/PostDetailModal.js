import React from 'react';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import './post-detail-modal.css';
import { toggleModal } from '../../actions/modal';
import { currentPostId } from '../../actions/postSlider';
import PostDetail from './PostDetail';
import PropTypes from "prop-types";


class PostDetailModal extends React.Component {
  constructor(props) {
    super(props);
    this.slide = React.createRef();
  }

  // close modal if gray background is clicked
  handleClickOutside = event => {
    // We need to check that our current is actually filled in with a DOM element.
    // Then using the DOM method contains we ask our container if we have the event.target
    // which is the DOM element that was clicked.
    if (this.slide.current && !this.slide.current.contains(event.target)) {
      this.props.toggleModal()
    }
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  slidePost = num => {
    const { id, posts } = this.props.postSlider;
    // find index of the current post in posts array
    const currentPostIndex = posts.findIndex(post => post.id === id);
    // calculate index of the next post to show, depending on the num argument
    // if num = 1 it's next post, if num = -1  it's previous one
    let nextPostIndex = currentPostIndex + num;
    // after reaching the last post return to the first one
    if (nextPostIndex > posts.length - 1) nextPostIndex = 0;
    // before first post return to the last one
    if (nextPostIndex < 0) nextPostIndex = posts.length - 1;
    // get id of the next displayed post
    const nextPostId = posts[nextPostIndex].id;
    this.props.currentPostId(nextPostId)
  };

  render() {
    return (
      <div className="my-modal">
        <span className="cross">&times;</span>
        <Container ref={this.slide}>
          <Row className="align-items-center">
            <Col sm={1} className="d-sm-block arrow" onClick={() => this.slidePost(-1)}>&#10094;</Col>
            <Col sm={10}><PostDetail /></Col>
            <Col sm={1} className="d-sm-block arrow" onClick={() => this.slidePost(1)}>&#10095;</Col>
          </Row>
        </Container>
      </div>
    )
  }
}


PostDetailModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  postSlider: PropTypes.object.isRequired,
};


const mapStateToProps = state => ({
  postSlider: state.postSlider
});


export default connect(mapStateToProps, { toggleModal, currentPostId })(PostDetailModal);
