import React from 'react';

export default (props) => {
  return props.typingUser !== null ? (
    <span className="user-typing-notification animated infinite pulse">
      {`${props.typingUser} is typing...`}
    </span>
  ) : null;
};
