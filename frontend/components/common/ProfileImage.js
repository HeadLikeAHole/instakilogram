import React from 'react';
import PropTypes from "prop-types";


class ProfileImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {mode: ''};
    this.imgElement = React.createRef();
  }

  static propTypes = {
    src: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func
  };

  // find out what mode the image is in (landscape or portrait) to apply appropriate css class
  // this method doesn't work properly inside componentDidMount method since componentDidMount doesn't wait
  // for images to load and thus some image's width and height equal to zero on rendering
  // instead it should be called by image event "onLoad"
  landscapeOrPortrait = () => {
    const width = this.imgElement.current.naturalWidth;
    const height = this.imgElement.current.naturalHeight;
    if (width > height) {
      this.setState({mode: 'landscape'})
    } else {
      this.setState({mode: 'portrait'})
    }
  };

  render() {
    const { src, className, onClick } = this.props;
    return (
      // outer container
      <div className={className} onClick={onClick ? onClick : undefined}>
        {/* inner container */}
        <div className="square square-to-circle">
          <img src={src} className={this.state.mode} ref={this.imgElement} onLoad={this.landscapeOrPortrait} />
        </div>
      </div>
    )
  }
}


export default ProfileImage;
