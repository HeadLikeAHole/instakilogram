import React from 'react';
import PropTypes from 'prop-types';

import Comment from './Comment';



const ReplyList = props => {
  return (
    <React.Fragment>
      {/* loop through replies */}
      {props.replies.map(
        comment => <Comment key={comment.id} comment={comment} />
      )}
    </React.Fragment>
  )
};


ReplyList.propTypes = {
  replies: PropTypes.array
};


export default ReplyList;
