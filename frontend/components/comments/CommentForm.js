import React from 'react';
import PropTypes from "prop-types";
import { addComment, addReply, editComment } from '../../actions/commentList';
import { addCommentFormInfo } from '../../actions/commentFormInfo';
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
    addReply: PropTypes.func.isRequired,
    editComment: PropTypes.func.isRequired,
    editReply: PropTypes.func.isRequired,
    addCommentFormInfo: PropTypes.func.isRequired
  };

  handleChange = event => {
    this.setState({text: event.target.value});
  };

  clearForm = () => this.setState({ text: '' });

  // submit comment
  handleSubmit = event => {
    event.preventDefault();
    // if commentFormInfo doesn't contain text comment is added otherwise updated
    if (!this.props.commentFormInfo.text) {
      // if commentFormInfo doesn't contain parent_id comment is added otherwise reply is added
      if (!this.props.commentFormInfo.parent_id) {
        this.props.addComment(this.state.text, this.props.post_id);
      } else {
        this.props.addReply(
          this.state.text,
          this.props.post_id,
          this.props.commentFormInfo.parent_id,
          this.props.addCommentFormInfo // resets state after successful reply submission
        );
      }
    } else {
      this.props.editComment(this.state.text, this.props.commentFormInfo.comment_id, this.props.commentFormInfo.parent_id);
    }
    this.clearForm()
  };

  // if "Ответить" link is clicked @<username> is added to textarea and textarea is focused
  // if "Редактировать" link is clicked then edited comment text is added to textarea
  // "&& Object.getOwnPropertyNames(this.props.commentFormInfo).length !== 0 checks if object isn't empty because after successful reply submission
  // commentFormInfo is reset to empty object which triggers componentDidUpdate method and in this case it's not needed
  componentDidUpdate(prevProps) {
    if (this.props.commentFormInfo !== prevProps.commentFormInfo && Object.getOwnPropertyNames(this.props.commentFormInfo).length !== 0) {
      let text;
      if (this.props.commentFormInfo.text) {
        text = this.props.commentFormInfo.text
      } else {
        text = '@' + this.props.commentFormInfo.username + ' ';
      }
      this.setState({text});
      this.textArea.current.focus()
    }
  }

  // empty "CommentFormInfo" state when navigating to a different page
  // so when you return to post detail and add a comment you don't reply to a comment saved in "CommentFormInfo"
  componentWillUnmount() {
    this.props.addCommentFormInfo({})
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
  commentFormInfo: state.commentFormInfo
});


export default connect(mapStateToProps, { addComment, addReply, editComment, addCommentFormInfo })(CommentForm);
