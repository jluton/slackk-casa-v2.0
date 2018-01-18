const WebSocket = require('ws');

const { updateWorkSpace } = require('./workSpaces');
const db = require('../database');

// creates a response object for sending to clients
/*
Object used for communication between server and clients through WebSockets -
{
  code: Only sent by server when responding to a request from a client, follows HTTP status code conventions
  message: Only sent by server when responding to a request from a client, text description of the code number
  method: Always required, dictates what the request/response is for (GETMESSAGES, POSTMESSAGE, NEWMESSAGE)
  data: Data required to process the request/response method
}
*/
const response = (code, message, method, data) =>
  JSON.stringify({
    code,
    message,
    method,
    data,
  });

// sends data to all cients except client ws
const updateEveryoneElse = (ws, wss, data) => {
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

// event handler for incoming data from any client
const onMessage = async (ws, wss, data) => {
  let message;
  try {
    // attempt to parse data from client, if unparseable responsd back with 400 and parsing error
    message = JSON.parse(data);
  } catch (err) {
    return ws.send(response(400, err.message));
  }

  // switch case to determine what to do with the message
  switch (message.method) {
    case 'GETMESSAGES':
    // method GETMESSAGES returns a list of previous messages for the given workspaceId
    
      try {
        const messages = await db.getMessages(Number(message.data.workspaceId));
        // respond back to client with success response and list of messages if successfully pulled from database
        return ws.send(response(200, 'Request success', message.method, messages));
      } catch (err) {
        // respond back to client with error response and error message if messages can't be pulled from database
        return ws.send(response(400, err.stack, message.method));
      }
    case 'POSTMESSAGE':
    // method POSTMESSAGE posts a message to the workspace for the given workspaceId
      try {

          let special_type = null;
          if (message.data.text.slice(0, 5) === '/poll') {
            special_type = 'poll';
          }

        // post the given message to the database
        let postedMessage = await db.postMessage(
          message.data.text,
          message.data.username,
          message.data.workspaceId,
          special_type
        );
        [postedMessage] = postedMessage.rows;
        // respond back to client with success response and list of messages if successfully posted to the database
        ws.send(response(201, 'Post success', message.method, postedMessage));
        // notify all other connected clients that a new message has been posted with a NEWMESSAGE response
        return updateEveryoneElse(
          ws,
          wss,
          response(200, 'New message', 'NEWMESSAGE', {
            message: postedMessage,
            workspaceId: message.data.workspaceId,
          }),
        );
      } catch (err) {
        // respond back to client with error response and error message if message can't be posted to database
        return ws.send(response(400, err.stack, message.method));
      }
    
    case 'SENDWORKSPACE':
    // SENDWORKSPACE informs the server that the client's current workspace has changed.
    /*
      {
        method: 'SENDWORKSPACE',
        data: {
          username: 'Rick_Astley'
          currentWorkSpaceId: 3,
          currentWorkSpaceName: 'testSpace3',
      },
    */
      // It should update the work spaces object when a client changes workspace. test it out.
      try {
        const { username, currentWorkSpaceId, currentWorkSpaceName } = message.data;
        // if client username has not be saved, save it to the websocket.
        if (ws.activeUserData.username === null) ws.activeUserData.username = username;
        // update the workspace memory object
        updateWorkSpace(ws, currentWorkSpaceId);
        // update the workspace on the websocket
        ws.activeUserData.currentWorkSpaceName = currentWorkSpaceName;
        ws.activeUserData.currentWorkSpaceId = currentWorkSpaceId;
        // respond back to client with success response and updated client active user info.
        return ws.send(response(201, 'Post success!', ws.activeUserData));
      } catch (err) {
        // respond back to client with error response and error message if workspace can't be updated.
        return ws.send(response(400, err.stack, message.method));
      }

    case 'SENDTYPINGSTATE':
    // SENDTYPINGSTATE informs the server that the client's currentlyTyping state has changed.
    /*
      {
        method: 'SENDTYPINGSTATE',
        data: {
          username,
          currentlyTyping,
          workspaceId,
        },
      }
    */
      ws.currentlyTyping = message.data.currentlyTyping;
      console.log(ws);
      return ws.send(response(201));

    default:
      // unknown message sent to server, respond back to client
      return ws.send(response(405, 'Unknown method', message.method));
  }
};

// event handler for when client connects to websocket server
const onConnect = (ws, wss) => {
  // initializes current user information
  ws.activeUserData = {
    username: null,
    currentlyTyping: false,
    currentWorkSpaceName: null,
    currentWorkSpaceId: null,
  };
  // attaches event handler for when client sends message to server
  ws.on('message', data => onMessage(ws, wss, data));
};

module.exports = {
  onConnect,
};
