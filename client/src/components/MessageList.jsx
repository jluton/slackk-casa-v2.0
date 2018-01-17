import React from 'react';
import { Container, ListGroup } from 'reactstrap';
import MessageEntry from './MessageEntry.jsx';

//container for message components
export default ({ messages, currentWorkSpaceId }) => (
  <div className="message-list-container">
    <Container>
      {messages.map(message => <MessageEntry message={message} key={message.id} />)}
    </Container>
  </div>
);
