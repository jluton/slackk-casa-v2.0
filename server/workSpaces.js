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

module.exports = { generateWorkSpaceMemory, activeWorkSpaces };
