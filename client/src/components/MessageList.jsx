import React from 'react';
import { Container, ListGroup } from 'reactstrap';
import MessageEntry from './MessageEntry.jsx';
import PollEntry from './PollEntry.jsx';

//container for message components
export default ({ messages, currentWorkSpaceId }) => (
  <div className="message-list-container">
    <Container>
      {messages.map(message => {
      	if (message.feature === 'poll') {
      		<PollEntry questions={message} key={message.id} />
      	} else {
      		<MessageEntry message={message} key={message.id} />	
      	}})	
    	}
    </Container>
  </div>
);


