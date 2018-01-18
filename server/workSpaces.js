const db = require('./../database/index.js');

const generateWorkSpaceMemory = function() {
  // fetch workspaces from database
  const savedWorkSpaces = db.getWorkspaces();
  const activeWorkSpaces = {};
  console.log(savedWorkSpaces);
  // for each workspace from db, create a property on workSpaces equal to the workSpaceId, 
  // that points to an empty object.
};