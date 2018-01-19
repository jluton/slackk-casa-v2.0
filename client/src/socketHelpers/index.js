const { incomingMessageNotification } = require('./../helpers.js');

let ws = null;
let app = null;
let sent = false;
const beep = new Audio('/sounds/pling.wav'); // sound on receive msg
const oneup = new Audio('/sounds/coin.wav'); // sound on send msg

/* takes in an array of messages
  objects and sets the component state messages
  with the new array of messages recieved */
const loadMessages = (messages) => {
  app.setState({ messages });
};

/* takes in message as object
   msg ({id: INT, text: STRING, createdAt: DATE, workspaceId: INT})
   and concats message to message state of app */
const addNewMessage = (message) => {
  if (sent) {
    sent = false;
  } else {
    beep.play();
  }
  app.setState({ messages: [...app.state.messages, message] });
};

// takes in an array of users and sets the current app state
const setUsers = (users) => {
  app.setState({ users });
};

// takes in a parameter and sends that parameter to the socket server
const sendMessage = (data) => {
  const {
    username, text, workspaceId, isImage,
  } = data;
  
  const msg = {
    method: 'POSTMESSAGE',
    data: {
      username,
      text,
      workspaceId,
      isImage,
    },
  };
  oneup.play();
  sent = true;
  ws.send(JSON.stringify(msg));
};

const sendTypingState = (data) => {
  console.log('sendTypingState runs on client');
  const { username, currentlyTyping, workspaceId } = data;
  const msg = {
    method: 'SENDTYPINGSTATE',
    data: {
      username,
      currentlyTyping,
      workspaceId,
    },
  };
  ws.send(JSON.stringify(msg));
};

const sendCurrentWorkSpace = (data) => {
  const { currentWorkSpaceId, currentWorkSpaceName, username } = data;
  const msg = {
    method: 'SENDWORKSPACE',
    data: {
      username,
      currentWorkSpaceId,
      currentWorkSpaceName,
    },
  };
  ws.send(JSON.stringify(msg));
};

// takes a workspace Id as INT for parameter and returns the messages for that current workspace
const getWorkSpaceMessagesFromServer = (id) => {
  const msg = { method: 'GETMESSAGES', data: { workspaceId: id } };
  ws.send(JSON.stringify(msg));
};

// takes in all new messages and filters and concats messages that match the current workSpace
const filterMsgByWorkSpace = (msg) => {
  if (sent) {
    sent = false;
  } else {
    beep.play();
  }
  if (msg.workspaceId === app.state.currentWorkSpaceId) {
    app.setState({ messages: [...app.state.messages, msg.message] });
  }
};

// ws refers to websocket object
const afterConnect = () => {
  ws.onmessage = (event) => {
    const {
      method,
      message,
      code,
      data,
    } = JSON.parse(event.data);

    // TODO: better error handling. Temp till complete switch statements
    if (code === 400) {
      console.log(method);
      throw message;
    }

    switch (method) {
      case 'GETMESSAGES':
        loadMessages(data);
        break;
      case 'NEWMESSAGE':
        incomingMessageNotification(data);
        filterMsgByWorkSpace(data);
        break;
      case 'GETUSERS':
        setUsers(data);
        break;
      case 'POSTMESSAGE':
        addNewMessage(data);
        break;
      case 'SENDWORKSPACE':
        console.log('event ', event);
        console.log('SENDWORKSPACE response data ', JSON.parse(event.data));
        break;
      case 'SENDTYPINGSTATE':
        console.log('SENDTYPINGSTATE response data ', JSON.parse(event.data));
        break;
      case 'USERCHANGEDTYPINGSTATE':
        console.log('USERCHANGEDTYPINGSTATE response data ', JSON.parse(event.data));
        break;
      default:
    }
  };
};

// takes in server ip or wss protocall to connect to server
// takes in component to have scope in function
const connect = (server, component) => {
  // create new socket server instance
  ws = new WebSocket(server);
  app = component;
  // on connection run the callback
  ws.addEventListener('open', () => {
    console.log('Connected to the server');
    // sets state to current socket session for App methods to have access
    app.setState({ ws });

    // gets workspaces after connection
    app.loadWorkSpaces();

    // calls after connect function that takes in the socket session
    // and app component
    afterConnect();
  });
};

export {
  connect,
  sendMessage,
  afterConnect,
  getWorkSpaceMessagesFromServer,
  incomingMessageNotification,
  sendTypingState,
  sendCurrentWorkSpace,
};
