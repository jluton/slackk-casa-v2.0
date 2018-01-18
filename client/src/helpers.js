// Takes in NEWMESSAGE data and then creates a notification.
const incomingMessageNotification = (data) => {
  const { Notification } = window;
  // Checks if browser has permission to display notifications
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
  } else if (Notification.permission !== 'denied' && Notification.permission !== 'granted') {
    Notification.requestPermission();
  // If permission is granted, create a message notification.
  } else if (Notification.permission === 'granted') {
    const { username, text } = data.message;
    const workspaceName = app.state.workSpaces.filter(workspace => workspace.id === data.workspaceId)[0].name;
    return new Notification(`New message from ${username} in #${workspaceName}: ${text}`);
  }
};

module.exports = { incomingMessageNotification };
