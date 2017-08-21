var mongoose = require('mongoose');
var Promise = require('bluebird');

var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };  

var theport = process.env.PORT || 5000;

var uristring =  'mongodb://heroku_tkrwhxb3:ljk1iikq8pag0rcusofkbir363@ds149613.mlab.com:49613/heroku_tkrwhxb3' ||
  'mongodb://localhost/musetrap';


var mongoURI = 'mongodb://localhost/test';

mongoose.connect(process.env.MONGOLAB_URI || mongoURI);


var db = mongoose.connection;
db.on('error', console.error);

var Schema = mongoose.Schema;

var sequenceSchema = new Schema ({
  user: String,
  sequenceRows: [{}],
  shareable: {type: Boolean, default: false}
})


var userSchema = new Schema({
  userName: {type: String, unique: true, required: true},
  passWord: String
})

var sampleSchema = new Schema ({
  id: Schema.Types.ObjectId,
  url: String, 
  name: String
})

var soundBoardMatrix = [
  {beat: undefined, row: [0, 0, 0, 0, 0, 0, 0, 0]},
  {beat: undefined, row: [0, 0, 0, 0, 0, 0, 0, 0]},
  {beat: undefined, row: [0, 0, 0, 0, 0, 0, 0, 0]},
  {beat: undefined, row: [0, 0, 0, 0, 0, 0, 0, 0]}
]

let newUser = function(name, password) {
  var user = new Users (
    { userName: name,
      passWord: password
    });
  var query = Users.findOne({userName: name});
  var promise = query.exec();
    
  return promise
  .then((results) => {
    if (results !== null) {
      throw 'duplicate entry';
    } else {
      return 'dummy';
    }
  })
  .then(() => {
    return user.saveAsync()
  });
}

let updateSequence = function(sequence) {
  var promise = Sequences.findById(sequence._id).exec();

  return promise.then(function(newSequence) {
    newSequence.shareable = sequence.shareable;
    newSequence.sequenceRows = sequence.sequenceRows;

    return newSequence.save(); 
  })
  .then(function(newSequence) {
    console.log('updated sequence: ', newSequence);
    return newSequence;
  })
  .catch(function(err){
    // just need one of these
    console.log('error:', err);
    throw err;
  });
}

let createSequence = function(sequence){
 var newSequence = new Sequences ({
    user: sequence.user,
    sequenceRows: sequence.sequenceRows,
  });
  return newSequence.saveAsync();
}

let saveSequence = function(sequence) {
  return createSequence(sequence)
}

let findSequences = function(user) {
  return Sequences.find()
  .where('user').equals(user)
  .limit(10)
  .exec(function(err, results){
    if(err){console.log('find err', err)}
    return results;
  })
}

let loginUser = function(username, password){
  return Users.find()
  .where('userName').equals(username)
  .where('passWord').equals(password)
  .exec(function(err, user){
    if(err){console.log('Could not log in: ', err)}
    else if (user) {
      return true;
    }
  })
}

let Users = mongoose.model('Users', userSchema);

let Sequences = mongoose.model('Sequences', sequenceSchema);

let Samples = mongoose.model('Samples', sampleSchema);

Promise.promisifyAll(Users);
Promise.promisifyAll(Users.prototype);
Promise.promisifyAll(Sequences);
Promise.promisifyAll(Sequences.prototype);

module.exports = {
  newUser: newUser,
  saveSequence: saveSequence,
  Sequences: Sequences,
  updateSequence: updateSequence,
  findSequences: findSequences,
  Users: Users,
  loginUser: loginUser
}