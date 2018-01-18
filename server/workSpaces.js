const db = require('./../database/index.js');

// create an object in which to store active users.
const activeWorkSpaces = {};

// Adds an object to activeWorkSpaces for each stored workspace, with id as key.
// Individual workspace objects will track users actively using the workspace.
const generateWorkSpaceMemory = async function () {
  try {
    // fetches all workspaces from database.
    const workspaces = await db.getWorkspaces();
    workspaces.forEach((workspace) => {
      activeWorkSpaces[workspace.id] = {};
    });
  } catch (err) {
    console.error(err);
  }
};

setTimeout(() => {
  console.log('creates active work spaces: ', activeWorkSpaces);
}, 3000);

const updateWorkSpace = function (ws, newWorkSpaceId) {
  //updates work space, but username is null
  const { currentWorkSpaceId, username } = ws.activeUserData;
  if (currentWorkSpaceId !== null && activeWorkSpaces[currentWorkSpaceId][username]) {
    delete activeWorkSpaces[currentWorkSpaceId][username];
  }
  activeWorkSpaces[newWorkSpaceId][username] = ws;
  console.log('updated active workspaces', activeWorkSpaces);
};

module.exports = { generateWorkSpaceMemory, activeWorkSpaces, updateWorkSpace };
