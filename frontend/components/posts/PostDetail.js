import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import NavDropdown from "react-bootstrap/NavDropdown";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './post-detail.css';
import './post.css';

import { loadPostDetail } from '../../actions/postDetail';
import { deletePost } from '../../actions/postList';


class PostDetail extends React.Component {
  componentDidMount() {
    this.props.loadPostDetail(this.props.match.params.id);
  }

  render() {
    const { authUser, post } = this.props;

    let authorized = false;

    // dropdown menu with edit and delete links
    const editDelete = (
      <NavDropdown alignRight title="..." id="collasible-nav-dropdown" className="p-0 dots">
        <NavDropdown.Item href="#action/3.1">Редактировать</NavDropdown.Item>
        <NavDropdown.Item onClick={this.props.deletePost.bind(this, post.id)}>Удалить</NavDropdown.Item>
      </NavDropdown>
    );

    // check if current logged in user is post author
    if (authUser) {
      if (authUser.id === post.user) {
        authorized = true
      }
    }

    return (
      // "p-d" in class names stands for post detail
      // "noGutters={true}" removes the gutter spacing between Cols as well as any added negative margins
      <Row noGutters={true} className="mt-5 p-d-border">
        {/* post image */}
        <Col lg={7} className="align-self-center">
          <Image src={post.image} className="w-100" />
        </Col>
        <Col className="bg-white">
          {/* post author */}
          <Row noGutters={true} className="p-3 align-items-center p-d-border-bottom">
            <Col>
              <Image src={post.profile_image} roundedCircle fluid className="mr-2 p-d-profile-img" />
              {post.username}
              {authorized && editDelete}
            </Col>
          </Row>
          {/* post description */}
          <Row noGutters={true} className="p-3 p-d-border-bottom">
            {post.description}
          </Row>
          {/* comments */}
          <Row noGutters={true} className="p-3 p-d-border-bottom">
            <textarea></textarea>
          </Row>
          {/* icons */}
          <Row noGutters={true} className="p-3 p-d-border-bottom">
            <i className="far fa-heart my-icon"></i>
            <i className="far fa-comment my-icon"></i>
            <i className="far fa-bookmark my-icon"></i>
          </Row>
          {/* add comment field */}
          <Row noGutters={true} className="px-3 py-2 align-content-center p-d-border-bottom">
            <Col>
              <textarea placeholder="Добавить комментарий..." className="w-100 p-d-textarea"></textarea>
            </Col>
            <Col xs={1}>
              <a href="" className="nav-link">OK</a>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}


PostDetail.propTypes = {
  authUser: PropTypes.object,
  post: PropTypes.object.isRequired
};


// make state available to PostDetail component though props
const mapStateToProps = state => ({
  authUser: state.auth.user,
  post: state.postDetail
});


export default connect(mapStateToProps, { loadPostDetail, deletePost })(PostDetail);
