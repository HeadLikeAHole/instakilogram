import React from 'react';
import PropTypes from "prop-types";
import { addComment, addReply } from '../../actions/commentList';
import { addReplyInfo } from '../../actions/reply';
import { connect } from 'react-redux';


class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
    this.textArea = React.createRef();
  }

  static propTypes = {
    addComment: PropTypes.func.isRequired,
    addReplyInfo: PropTypes.func.isRequired
  };

  handleChange = event => {
    this.setState({text: event.target.value});
  };

  clearForm = () => this.setState({ text: '' });

  // submit comment
  handleSubmit = event => {
    event.preventDefault();
    if (!this.props.replyInfo.parent_id) {
      this.props.addComment(this.state.text, this.props.post_id);
    } else {
      this.props.addReply(
        this.state.text,
        this.props.post_id,
        this.props.replyInfo.parent_id,
        this.props.addReplyInfo
      );
    }
    this.clearForm()
  };

  // if reply link is clicked add @<username> to textarea and focus on it
  // "&& this.props.replyInfo.parent_id" checks if object isn't empty because after successful reply submission
  // replyInfo is reset to empty values which triggers componentDidUpdate method in this case it's not needed
  componentDidUpdate(prevProps) {
    if (this.props.replyInfo !== prevProps.replyInfo && this.props.replyInfo.parent_id) {
      const text = '@' + this.props.replyInfo.username + ' ';
      this.setState({text});
      this.textArea.current.focus()
    }
  }

  render() {
    return (
      <React.Fragment>
        {/* textarea for comment text */}
        <textarea
          placeholder="Добавить комментарий..."
          className="p-d-textarea"
          value={this.state.text}
          onChange={this.handleChange}
          ref={this.textArea}
        ></textarea>
        {/* link which submits comment*/}
        <a href="" className="pr-0 nav-link" onClick={this.handleSubmit}>OK</a>
      </React.Fragment>
    )
  }
}


const mapStateToProps = state => ({
  replyInfo: state.reply
});



export default connect(mapStateToProps, { addComment, addReply, addReplyInfo })(CommentForm);
