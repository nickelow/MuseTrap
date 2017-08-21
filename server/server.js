//require("babel-register");
var React = require('react');

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
//const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

//uncomment this when ready to hook up the database
const db = require('../database/schema.js');
const compiler = webpack(webpackConfig);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../public'));
//app.use('/static', express.static(__dirname + '/../public'));

app.use(
  session({
    secret: 'i like to code and eat food',
    store: new MongoStore({
      url: 'mongodb://localhost/session'
    }),
    saveUninitialized: false,
    resave: false
  })
);

app.use(webpackDevMiddleware(compiler, {
  hot: true,
  filename: 'bundle.js',
  publicPath: '/',
  stats: {
    colors: true,
  },
  historyApiFallback: true,
}));

const verifySession = (req, res, next) => {
  if (req.session && req.session.user) {
    console.log('made it through verify session')
    next();
  } else {
    console.log('session did not check out');
    res.redirect('/');
  }
};

//TELL OTHER TEAM MEMBERS
//POSSIBLE TWEAKS TO DATABASE
//add a friends list into users schema????
//add "shared" true/false field to a sequence object? to authorize sharing of a particular sequence/song
//need database helper functions to return thenable promises because they are asynch
//I use express-session and connect-mongo to do authentication and sessions
//On the client side I installed react-router-dom to handle /, /member, /users/username/songID paths
//  using the same Main component
//  it should now know whether user is logged in and render accordingly
//  it should also know whether the demo page is sharing a song at /users/username/songID
//    and load the shared song accordingly


//PROBLEMS
//Problem1: webpack hijacks the serving of root "/" with index.html and ignores my app.get('/'...)
//          as a workaround, I just designated it as the demo page (pre-login) for now
//Problem2: Known bug: If Main app is on a different path such as /member, it will try to get audio files from
//          /member/audio_files which doesn't exist

/**GET /member
* should only be allowed to go to this member page after successful login on demo/login page
*/
app.get('/member', verifySession, function(req, res) {
  res.sendFile('index_member.html',{root : __dirname + '/../public'});
});

//GET /
//default demo/login page
//should have sign-in / create new account form at the top part of the page
//and still have a soundboard to play with in the center of the page
//webpack ignores this routing for some reason!!!!!!!!!!!!!!!!!!!!
//app.get('/', function(req, res) {
//  res.sendFile('index.html',{root : __dirname + '/../public'});
//});

/**POST /createuser
* Client at the demo/login page
* attempted user account creation, maybe from a "create account button"
* client needs to send username and password
* database's newUser helper function should be thenable
*/
app.post('/createuser', function(req, res) {
  console.log('create user ', req.body);
  var username = req.body.username;
  var password = req.body.password;
  db.newUser(username, password)
  //Promise.resolve('need db.newUser function') //temporary code until db.newUser is implemented
    .then(() => {
      //successful account creation
      console.log('created user successfully');
      req.session.user = username;
      res.redirect(302, '/member');
    })
    .catch((err) => {
      //something went wrong during account creation, retry again
      console.log('failed to create user');
      res.redirect(302, '/');
    });
});

/**POST /login
* at the /demo/login page
* attempted user login from the "login button"
* client needs to send username and password to server
* database's loginUser function should be thenable
*/
app.post('/login', function(req, res) {
  console.log('login user ', req.body);
  var username = req.body.username;
  var password = req.body.password;
  Promise.resolve('need db.loginUser function') //temporary code until db.loginUser is implemented
  //db.loginUser(username, password)
    .then(() => {
      //successful login
      req.session.user = username;
      res.redirect(302, '/member');
    })
    .catch((err) => {
      //something went wrong during login, retry again
      res.redirect(302, '/');
    });
});

/**POST /logout
* PURPOSE: logout attempt
* logout button was clicked somewhere on client side
*/
app.post('/logout', function(req, res) {
  req.session.destroy();
  res.redirect(302, '/');
});

/**GET /users
* PURPOSE OF THE CLIENT REQUEST TO SERVER: get all sequences for particular user
* Client should send 1 thing to Server...username
* Server should call database helper function DB.findSequences(username)
* Database helper function should give array of user's sequences and also be thenable
* Server should send back user's sequences back to Client where Client can render them somewhere
*/
app.get('/users', verifySession, function(req, res) {
  var username = req.body.username;
  console.log(username);
  db.findSequences(username)
    .then((results) => {
      res.send(results);
    })
    .error((err) => {
      res.status(500).send(err);
    });
});

/**POST /users
* PURPOSE OF THE CLIENT REQUEST TO SERVER: save particular sequence for a user
* Client should send 1 thing to Server... sequenceObj contents to be saved
* Database should save the sequence under the username and also be thenable
* Server should call database helper function DB.saveSequence(username, sequenceName, sequenceObj)
* Server should respond with 2xx response code back to Client
*/
app.post('/users', verifySession, function(req, res) {
  var sequenceObj = req.body.sequenceObj;
  db.saveSequence(sequenceObj)
    .then(() => {
      res.status(201).send();
    })
    .error((err) => {
      res.status(500).send(err);
    });
});

/**PUT /users
* PURPOSE OF THE CLIENT REQUEST TO SERVER: update particular sequence for a user
* Client should send 1 thing to Server... sequenceObj contents to be updated
* Database should update the sequence under the username and also be thenable
* Server should call database helper function DB.updateSequence(username, sequenceName, sequenceObj)
* Server should respond with 2xx respond code back to Client
*/
app.put('/users', verifySession, function(req, res) {
  var sequenceObj = req.body.sequenceObj;
  db.updateSequence(sequenceObj)
    .then(() => {
      res.status(201).send();
    })
    .error((err) => {
      res.status(500).send(err);
    });
});

//SHARING A SEQUENCE.............
//Client should force user to save the sequence before sharing

/**GET /users/share
* PURPOSE: User wants to share a song; redirect user to shareable link that goes to demo page which loads a saved song
* Client should force user to save the sequence before sharing
* Database should mark the sequence's share=true and also be thenable
* Server should ask database to mark the song as share=true
* Server should redirect user to shareable link localhost:3000/users/username/sequenceName
*/
app.get('/users/share', verifySession, function(req, res) {
  var username = req.body.username;
  var sequenceName = req.body.sequenceName;
  db.shareSequence(username, sequenceName)
    .then(() => {
      //redirect to shared link
      res.redirect(302, `/users/${username}/${sequenceName}`);
    })
    .error((err) => {
      res.status(500).send();
    });
});

/**GET /users/:username/:sequenceName
* PURPOSE: this is essentially the demo page PLUS the shared sequence/song loaded up on the player
* Server should return a 404 error if user doesn't exist, the sequenceName doesn't exist, or  is not shared by owner
* Client should then ask the server to retrieve the particular user's sequenceName to load on the page
*/
app.get('/users/:username/:sequenceName', function(req, res) {
  var username = req.params.username;
  var sequenceName = req.params.sequenceName;
  //If user doesn't exist, sequenceName doesn't exist under user, or sequenceName is not shared, return a 404 error
  db.findSequences(username)
    .then((results) => {
      var sequenceEntry;
      for (var i = 0; i < results.length; i++) {
        if (sequenceName === results[i].name) {
          sequenceEntry = results[i];
          break;
        }
      }
      if (sequenceEntry === undefined || !sequenceEntry.shared) {
        throw 'No song found or song is not allowed by owner to share';
      } else {
        return sequenceEntry;
      }
    })
    .then((seqEntry) => {
      res.sendFile('index.html',{root : __dirname + '/../public'});
    })
    .catch((err) => {
      res.status(404).send();
    });
});

if (!module.parent) {
  var port = process.env.PORT || 3000;
  const server = app.listen(port, function() {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
  });
}

module.exports={
  app: app,
  db: db.db
}
