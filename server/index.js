const express = require('express');
const { Server: WebSocketServer } = require('ws');
const router = require('./routes');
const { onConnect } = require('./webSocket');
const { generateWorkSpaceMemory } = require('./workSpaces');
const { client } = require('./../database/index');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const server = express()
  .use(router)
  .listen(PORT, () => console.log(`slackk-casa listening on port ${PORT}`));

generateWorkSpaceMemory();

// setInterval keeps database connection open. Hacky fix, investigate further when able.
setInterval(() => {
  client.query('SELECT 1');
}, 55000);

// create a WebSocket server and attach to Express server to share ports
const wss = new WebSocketServer({ server });

// event handler for each client connection, passes to webSocket.js helpers
wss.on('connection', ws => onConnect(ws, wss));

module.exports = server;
