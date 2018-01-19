const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const db = require('../database');
const auth = require('./auth');
const passport = require('./passport');
const email = require('./email');
const aws = require('../server/aws.js');
/*
  Express routes
*/

const router = express.Router();

var storage = multer.memoryStorage()
var upload = multer({
  storage: storage,
  limits:{fileSize: 2000000},
}).single('file')

router.use(cookieParser());
router.use(session({ secret: 'slackk-casa', resave: false, saveUninitialized: false }));
router.use(passport.initialize());
router.use(passport.session());

// helper response function to redirect react router paths to index.html
const reactRoute = (req, res) => res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));

router.use(express.static(path.join(__dirname, '../client/dist')));

// send index.html for react router's routes
router.get('/signup', reactRoute);
router.get('/login', reactRoute);
router.get('/messages', passport.authenticate('local', { failureRedirect: '/login' }), reactRoute);

// POST request to /signup, used to register users
/*
  Request object from client
  {
    username: 'testUser',
    password: 'mypassword',
    email: 'test@test.com',
    passwordHint: 'favorite hobby',
  }

  Server response status codes:
    - 200 - User successfully created
    - 400 - Username already exists
    - 401 - Database error, all other errors
*/
router.post('/signup', bodyParser.json());
router.post('/signup', async (req, res) => {
  try {
    if (await db.getUser(req.body.username)) {
      return res.status(400).json('username exists');
    }
    await auth.addUser(req.body.username, req.body.password, req.body.email, req.body.passwordHint);
    email.sendWelcomeEmail(req.body.username, req.body.email).then().catch();
    return res.sendStatus(200);
  } catch (err) {
    return res.status(401).json(err.stack);
  }
});

// POST request to /login, used to authenticate users
/*
  Request object from client:
  {
    username: 'testUser',
    password: 'mypassword',
  }

  Server response status codes:
    - 200 - Successfully authenticated
    - 401 - User login incorrect
*/
router.post('/login', bodyParser.json());
router.post('/login', passport.authenticate('local'), (req, res) => res.sendStatus(200));

// POST request to /recover, used to get password hint for user
/*
  Request object from client:
  {
    username: 'testUser',
  }

  Server response to client
  {
    password_hint: 'favorite hobby',
  }

  Server response status codes:
  - 500 - Database error, all other errors
*/
router.post('/recover', bodyParser.json());
router.post('/recover', async (req, res) => {
  try {
    const hint = await db.getPasswordHint(req.body.username);
    return res.status(200).json(hint);
  } catch (err) {
    return res.status(500).json(err.stack);
  }
});

// GET request to /workspaces, return array of workspaces
/*
  Returns to client array of workspace objects
  [
    {
      id: 1,  // workspace id
      name: 'testWorkspace',  // workspace display name
      db_name: 'ws_t1516045064857',  // name of table for workspace's messages
    }
  ]
*/
router.get('/workspaces', async (req, res) => {
  try {
    return res.status(200).json(await db.getWorkspaces());
  } catch (err) {
    return res.status(500).json(err.stack);
  }
});

// POST request to /workspaces, used to create a new workspace
/*
  Request object from client:
  {
    name: 'my workspace', //name of workspace to create
  }

  Server response status codes:
    - 201 - Workspace successfuly created
    - 400 - Workspace already exists
    - 500 - Database error, all other errors
*/
router.post('/workspaces', bodyParser.json());
router.post('/workspaces', async (req, res) => {
  try {
    let workspaces = await db.getWorkspaces();
    if (
      workspaces.find(workspace => workspace.name.toLowerCase() === req.body.name.toLowerCase())
    ) {
      return res.status(400).json('workspace exists');
    }
    await db.createWorkspace(req.body.name);
    workspaces = await db.getWorkspaces();
    return res.status(201).json(workspaces);
  } catch (err) {
    return res.status(500).json(err.stack);
  }
});


router.post('/workspaces/membership', bodyParser.json(), async (req, res) => {
  try {
    const { ws, user, action } = await req.body;
    await db.joinWorkspace(user, ws, action);
    return res.sendStatus(201);
  } catch (err) {
    return res.status(404).json(err.stack);
  }
});

router.post('/workspaces/check', bodyParser.json(), async (req, res) => {
  try {
    const { ws, user } = await req.body;
    const bool = await db.isInWorkspace(user, ws);
    return res.status(200).send(bool);
  } catch (err) {
    return res.status(404).json(err.stack);
  }
});
// POST request to /upload, used to upload file
/*
  Request object from client:
  {
  }
  Server response status codes:
    - 201 - File successfuly uploaded
    - 400 - File already exists
    - 500 - Database error, all other errors
*/

router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      let { originalname } = req.file;
      aws.awsUploader(originalname, req.file.buffer, () => {
      originalname = originalname.split(' ').join('+')
      res.send(`https://s3-us-west-1.amazonaws.com/reslack/${originalname}`);
      })
    }
  })
})

router.get('/workspaces/:id/members', async (req, res) => {
  try {
    const { id } = req.params;
    const users = await db.getMembers(id);
    return res.status(200).send(JSON.stringify(users));
  } catch (err) {
    return res.status(404).json(err.stack);
  }
});


module.exports = router;
