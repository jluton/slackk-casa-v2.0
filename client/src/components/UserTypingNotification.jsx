import React from 'react';

export default (props) => {
  return props.typingUser !== null ? (
    <span class="user-typing-notification">
      {`${props.typingUser} is typing...`}
    </span>
  ) : null;
};
