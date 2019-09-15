import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import Button from 'react-bootstrap/Button';

import { addComment, addReply, editComment } from '../../actions/commentList';
import { addCommentFormInfo } from '../../actions/commentFormInfo';


class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '', disabled: true, redirect: false
    };
    this.textArea = React.createRef();
  }

  static propTypes = {
    addComment: PropTypes.func.isRequired,
    addReply: PropTypes.func.isRequired,
    editComment: PropTypes.func.isRequired,
    addCommentFormInfo: PropTypes.func.isRequired,
    post_id: PropTypes.number.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    commentFormInfo: PropTypes.object.isRequired
  };

  // OK button is disabled if textarea doesn't contain any characters
  toggleDisableAttribute = () => {
    if (this.state.text) {
      this.setState({disabled: false})
    } else {
      this.setState({disabled: true})
    }
  };

  handleChange = event => this.setState({text: event.target.value}, () => this.toggleDisableAttribute());

  clearForm = () => this.setState({text: '', disabled: true});

  // submit comment
  handleSubmit = event => {
    event.preventDefault();
    if (this.props.isAuthenticated) {
      // if commentFormInfo doesn't contain text then comment is added otherwise updated
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
      this.clearForm();
    } else {
      this.setState({ redirect: true })
    }
  };

  // clear form, disable "OK" button and empty "CommentFormInfo" object in the redux state so if you start
  // replying to a comment and click "Отмена" and then want to add a regular comment you don't reply
  // to the comment saved in "CommentFormInfo" object
  handleCancel = () => {
    this.clearForm();
    this.props.addCommentFormInfo({})
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

  // empty "CommentFormInfo" object in the redux state when navigating to a different page
  // so when you return to post detail and add a comment you don't reply to a comment saved in "CommentFormInfo"
  // after replying to it before
  componentWillUnmount() {
    this.props.addCommentFormInfo({})
  }

  render() {
    const commentForm =
      <>
        {/* textarea for comment text */}
        <textarea
          placeholder="Добавить комментарий..."
          className="p-d-textarea"
          value={this.state.text}
          onChange={this.handleChange}
          ref={this.textArea}
        ></textarea>
        <Button variant="outline-dark" size="sm" className="my-2" onClick={this.handleCancel}>Отмена</Button>
        <Button variant="outline-dark" size="sm" className="ml-2 my-2" disabled={this.state.disabled} onClick={this.handleSubmit}>OK</Button>
      </>;

    return (
      <>
        {!this.state.redirect ? commentForm : <Redirect to="/login" />}
      </>
    )
  }
}


const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  commentFormInfo: state.commentFormInfo
});


export default connect(mapStateToProps, { addComment, addReply, editComment, addCommentFormInfo })(CommentForm);
