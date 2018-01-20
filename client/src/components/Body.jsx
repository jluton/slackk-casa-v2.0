import React from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import MessageList from './MessageList.jsx';
import WorkSpaceList from './WorkSpaceList.jsx';
import WorkspaceMenu from './WorkspaceMenu.jsx';

import PropTypes from 'prop-types';

//container for other containers
export default class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      workSpaces,
      messages,
      changeCurrentWorkSpace,
      currentWorkSpaceId,
      currentUser,
      workspaceMembers,
      updateWorkSpaces,
      typingUser,
    } = this.props;


    return (
      <Container fluid>
        <Row>
          <Col className="side-bar-col" xs="2">
            <WorkSpaceList
              workSpaces={workSpaces}
              updateWorkSpaces={updateWorkSpaces}
              changeCurrentWorkSpace={changeCurrentWorkSpace}
              currentWorkSpaceId={currentWorkSpaceId}
              currentUser={currentUser}
            />
          </Col>
          <Col className="message-list-col" xs="10">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <WorkspaceMenu
                currentWorkSpaceId={currentWorkSpaceId}
                currentUser={currentUser}
                workspaceMembers={workspaceMembers}
              />
              <div className="typing-notification">
                {userTypingNotification}
              </div>
              <MessageList
                messages={messages}
                currentWorkSpaceId={currentWorkSpaceId}
              />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

Body.propTypes = {
  messages: PropTypes.array,
  workspaces: PropTypes.array,
  currentWorkSpaceId: PropTypes.number,
}
