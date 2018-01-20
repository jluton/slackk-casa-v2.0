import React from 'react';
import axios, { post } from 'axios';
import { connect, sendMessage, sendTypingState, sendCurrentWorkSpace } from '../socketHelpers';
import { Input, Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import NavBar from './NavBar.jsx';
import MessageList from './MessageList.jsx';
import Body from './Body.jsx';
import SendFiles from './SendFiles.jsx';
import UserTypingNotification from './UserTypingNotification.jsx';

// The main component of the App. Renders the core functionality of the project.
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Default message informs the user to select a workspace
      messages: [
        {
          text: 'Welcome to slackk-casa! Please select or create a workspace!',
          username: 'Slack-bot',
          id: 0,
          createdAt: new Date(),
          workspaceId: 0,
        },
      ],
      users: [],
      workSpaces: [],
      file: null,
      query: '',
      currentWorkSpaceId: 0,
      currentWorkSpaceName: '',
      currentlyTyping: false,
      typingUser: null,
    };

    this.timer = null;
    
    this.updateWorkSpaces = this.updateWorkSpaces.bind(this);
    this.handleFileSubmit = this.handleFileSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  componentDidMount() {
    const server = location.origin.replace(/^http/, 'ws');
    // connect to the websocket server
    connect(server, this);
  }

  handleFileChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  handleFileSubmit(event) {
    event.preventDefault();
    const { file } = this.state;
    this.fileUpload(file)
      .then((response) => {
        console.log('success!');
        sendMessage({
          username: this.props.location.state.username,
          text: response.data,
          workspaceId: this.state.currentWorkSpaceId,
        });
      });
  }

  // fileUpload function thanks to Ashik Nesin: https://github.com/AshikNesin/axios-fileupload
  fileUpload(file) {
   const url = '/upload';
   const formData = new FormData();
   formData.append('file', file);
   const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
   }
   return post(url, formData, config)
 }
 
  turnOffTyping() {
    sendTypingState({
      username: this.props.location.state.username,
      currentlyTyping: false,
      workspaceId: this.state.currentWorkSpaceId,
    });
    this.setState({ currentlyTyping: false });
  }

  // Handle changes to current query value and currentlyTyping 
  handleChange(event) {
    // clear any timers set reset currentlyTyping
    clearTimeout(this.timer);
    // if not already typing, send change to server
    if (!this.state.currentlyTyping) {
      sendTypingState({
        username: this.props.location.state.username,
        currentlyTyping: true,
        workspaceId: this.state.currentWorkSpaceId,
      });
    }
    // changes the query state based on user input in text field
    // sets user as currently typing
    this.setState({
      query: event.target.value,
      currentlyTyping: true,
    });
    // set a timer to reset currentlyTyping back to false.
    this.timer = setTimeout(this.turnOffTyping.bind(this), 8000);
  }

  // sends message on enter key pressed and clears form
  // only when shift+enter pressed breaks to new line
  handleKeyPress(event) {
    // on key press enter send message and reset text box
    if (event.charCode === 13 && !event.shiftKey) {
      event.preventDefault();
      sendMessage({
        username: this.props.location.state.username,
        text: this.state.query,
        workspaceId: this.state.currentWorkSpaceId,
        isImage: false,
        workspaceMembers: [],

      });
      // resets text box and currentlyTyping data
      this.setState({
        query: '',
        currentlyTyping: false,
      });
      this.timer = null;
    }
  }

  // grabs all existing workspaces
  loadWorkSpaces() {
    fetch('/workspaces')
      .then(resp => resp.json())
      .then((workSpaces) => { this.updateWorkSpaces(workSpaces); })
      .catch(console.error);
  }

  updateWorkSpaces(workSpaces) {
    this.setState({ workSpaces });
  }

  // Helper function to reassign current workspace
  changeCurrentWorkSpace(id, name) {
    // update current workspace state for dropdown menu
    axios.get(`/workspaces/${id}/members`)
      .then(data => this.setState({ workspaceMembers: data.data }));
      
    // inform server of workspace change
    const workSpaceData = {
      currentWorkSpaceId: id,
      currentWorkSpaceName: name,
      username: this.props.location.state.username,
      typingUser: null,
    };
    sendCurrentWorkSpace(workSpaceData);

    this.setState(workSpaceData);
  }

  // renders nav bar, body(which contains all message components other than input), and message input
  render() {
    const {
      messages, query, workSpaces, currentWorkSpaceId, 
      currentWorkSpaceName, workspaceMembers, typingUser
    } = this.state;

    const { username } = this.props.location.state;

    const userTypingNotification = typingUser !== null ? 
      <UserTypingNotification typingUser={typingUser} /> : ' ';


    return (
      <div className="app-container">
        <NavBar
          currentWorkSpaceName={currentWorkSpaceName}
          currentWorkSpaceId={currentWorkSpaceId}
          currentUser={username}
          workspaceMembers={workspaceMembers}
        />
        <Body
          messages={messages}
          workSpaces={workSpaces}
          updateWorkSpaces={this.updateWorkSpaces}
          changeCurrentWorkSpace={(id, name) => this.changeCurrentWorkSpace(id, name)}
          currentWorkSpaceId={currentWorkSpaceId}
          currentUser={username}
          typingUser={typingUser}
          workspaceMembers={workspaceMembers}
        />
        <div className="console-container">
          <SendFiles
            fileSubmit={this.handleFileSubmit}
            change={this.handleFileChange}
          />
          <UserTypingNotification typingUser={typingUser} />
        </div>
        <div className="input-container">
          <Input
            value={query}
            className="message-input-box"
            type="textarea"
            name="text"
            placeholder={`Message #${currentWorkSpaceName || 'select a workspace!'}`}
            onChange={event => this.handleChange(event)}
            onKeyPress={event => this.handleKeyPress(event)}
          />
        </div>
      </div>
    );
  }
}
