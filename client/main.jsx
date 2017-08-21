import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Howler from 'howler';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import NaviBar from './components/NaviBar.jsx';
import SoundBoard from './components/SoundBoard.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import SampleLibrary from './components/SampleLibrary.jsx';
import SavedSequences from './components/SavedSequences.jsx';

/** Main component behavior
 * States:
 * Sequence object to describe the song
 * @constructor
 */
class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      intervalId: undefined, // interval id for SoundBoard loop
      playstatus: false, //'playing', 'paused', or 'stopped'
      loopButton: false,
      samples: [],
      bpm: 120, // moved bpm outside of sequence to make it modular
      sequence: [
        {
          sampleIndex: undefined, // index from the SampleLibrary setup during ComponentDidMount
          row: [ 0, 0, 0, 0, 0, 0, 0, 0 ]
        },
        {
          sampleIndex: undefined,
          row: [ 0, 0, 0, 0, 0, 0, 0, 0 ]
        },
        {
          sampleIndex: undefined,
          row: [ 0, 0, 0, 0, 0, 0, 0, 0 ]
        },
        {
          sampleIndex: undefined,
          row: [ 0, 0, 0, 0, 0, 0, 0, 0 ]
        }
      ],
      savedSequences: []
    };
    //session binds
    this.loginCB = this.loginCB.bind(this);
    this.createAcctCB = this.createAcctCB.bind(this);
    this.logoutCB = this.logoutCB.bind(this);

    //ControlPanel binds
    this.playClicked = this.playClicked.bind(this);
    this.stopClicked = this.stopClicked.bind(this);
    this.loopClicked = this.loopClicked.bind(this);
    this.saveClicked = this.saveClicked.bind(this);
    this.shareClicked = this.shareClicked.bind(this);
    this.playSequence = this.playSequence.bind(this);
    this.changeBPM = this.changeBPM.bind(this);

    // SoundLibrary binds
    this.playSampleFromLibrary = this.playSampleFromLibrary.bind(this);
    this.addSampleToBoard = this.addSampleToBoard.bind(this);

    // SoundBoard binds
    this.removeSampleFromBoard = this.removeSampleFromBoard.bind(this);
    this.toggleSoundOnBoard = this.toggleSoundOnBoard.bind(this);

    //SavedSequences binds
    this.loadSavedSequence = this.loadSavedSequence.bind(this);
  }

  /** When you doubleClick on a sample in the sampleLibrary, this function updates the sequence state adding it to the SoundBoard
    @param {number} indexOfSampleClicked
  */
  addSampleToBoard(sampleClicked) {
    for (var i = 0; i < this.state.sequence.length; i++) {
      if (this.state.sequence[i].sampleIndex === undefined) {
        var newSequence = Object.assign([], this.state.sequence);
        newSequence[i].sampleIndex = sampleClicked;
        this.setState({sequence: newSequence});
        break;
      }
    }
  }

  /** When you click on the X next to a sample name in the soundboard, this function removes the sample from the sequence and soundboard
     @param {number} indexOfSampleClicked
  */
  removeSampleFromBoard(sampleClicked) {
    var newSequence = Object.assign([], this.state.sequence);
    newSequence[sampleClicked].sampleIndex = undefined;
    newSequence[sampleClicked].row = [0,0,0,0,0,0,0,0]; // sets undefined row to all 0.
    this.setState({sequence: newSequence});
  }

  /** Triggers when you click on a sample in the sampleLibrary.
    @param {number} indexOfSampleClicked
  */
  playSampleFromLibrary(sampleClicked) {
    console.log(`Sample sound ${sampleClicked} clicked`);
    this.state.samples[sampleClicked].play();
  }


  /** Click Handler for soundboard. Toggles sound for each 1/8th duration.
  */
  toggleSoundOnBoard( row, col) {
    console.log(`clicked at ${row}, ${col}`);
    if (this.state.sequence[row].sampleIndex!==undefined) { // this fixes bug not toggling when 2 drums selected
      var newRow = this.state.sequence[row].row;
      if (newRow[col] === 0) {
        newRow[col] = 1;
      } else {
      newRow[col] = 0;
      }
      this.setState(() => {
        this.state.sequence[row].row = newRow;
        return {sequence:this.state.sequence};
      });
    }

  }

  componentDidMount() {
    console.log('props including react router props are,', this.props);

    var sampleLibrary = [
      { sampleId: 0, name: 'bass', url: './audio_files/sound-bass.wav'},
      { sampleId: 1, name: 'clap', url: './audio_files/sound-electronicClap.wav'},
      { sampleId: 2, name: 'hat1', url: './audio_files/sound-hat.wav'},
      { sampleId: 3, name: 'hat2', url: './audio_files/sound-hat2.wav'},
      { sampleId: 4, name: 'kick1', url: './audio_files/sound-kick.wav'},
      { sampleId: 5, name: 'kick2', url: './audio_files/sound-kick2.wav'},
      { sampleId: 6, name: 'kick3', url: './audio_files/sound-kick3.wav'},
      { sampleId: 7, name: 'percussion', url: './audio_files/sound-percussion.wav'},
      { sampleId: 8, name: 'pluck', url: './audio_files/sound-pluck.wav'},
      { sampleId: 9, name: 'snap', url: './audio_files/sound-snap.wav'},
      { sampleId: 10, name: 'snare', url: './audio_files/sound-snare.wav'},
      { sampleId: 11, name: 'speedy', url: './audio_files/sound-speedy.wav'},
      { sampleId: 12, name: 'synth', url: './audio_files/sound-synth.wav'},
      { sampleId: 13, name: 'trumpet', url: './audio_files/sound-trumpet.wav'},
      { sampleId: 14, name: 'vocal', url: './audio_files/sound-vocal.wav'},
      { sampleId: 15, name: 'yea', url: './audio_files/sound-vocoder.wav'}
    ];

    /** Loops over the sampleLibrary and returns each as a Howl object with methods
    */
    sampleLibrary = sampleLibrary.map( (sample, index) => {
      var newObj =  new Howl({
        src: [sample.url],
        autoplay: false,
        loop: false,
        onload:function(){
          // console.log(sample, "LOADED");
        },
        onend: function() {
          // console.log('Finished!');
        }
      });
      newObj.name = sample.name;
      newObj.sampleId = index;
      return newObj;
    })

    this.setState({samples: sampleLibrary})

    if (this.props.loggedIn) {
      this.getUserName()
        .then((username) => {
          this.getSavedSequences(username);
        });
    }

    //load shared song if this is a shareable link
    ///users/:username/:sequenceObjID
    if (this.props.sequenceObjID) {
      this.loadSharedSequence();
    }
  }


  /** Login to the app
  * @param {string} username
  * @param {string} password
  */
  loginCB(username,password) {
    axios.post('/login', {
      username: username,
      password: password
    })
    .then((res) => {
      console.log('successful login');
      window.location ='/member';
    })
    .catch((err) => {
      console.log('error during login', err);
    });
  }

  /** Create new account for the app
  * @param {string} username
  * @param {string} password
  */
  createAcctCB(username,password) {
    axios.post('/createuser', {
      username: username,
      password: password
    })
    .then((res) => {
      console.log('successful acct creation');
      window.location ='/member';
    })
    .catch((err) => {
      console.log('error during acct creation', err);
    });
  }

  /** Logout of the app
  */
  logoutCB() {
    axios.post('/logout', {}).then((res) => {
      console.log('successful logout');
      window.location ='/';
    })
    .catch((err) => {
      console.log('error during logout');
    });
  }

  /** Get username of person logged in, and also the usernames saved sequences
  */
  getUserName() {
    return axios.get('/username')
      .then((res) => {
        console.log('successful get username', res.data);
        var username = res.data;
        this.setState({
          username: username
        });
        return username;
      })
      .catch((err) => {
        console.log('error during username retrieval', err);
      });
  }

  /** Get the usernames saved sequences
  * @params username
  */
  getSavedSequences(username) {
    return axios.get('/users', {params: {username: username}})
      .then((res) => {
        console.log('successful saved sequences retrieval: ', res.data);
        this.setState({
          savedSequences: res.data
        });
        return true;
      })
      .catch((err) => {
        console.log('error during username and saved sequences retrieval', err);
        throw err;
      });
  }

  /** Load retrieved sequence to the page
  * @params index
  */
  loadSavedSequence(index) {
    //clear out the existing sequence first
    var sequence = [];
    for (var i = 0; i < this.state.sequence.length; i++) {
      sequence.push({sampleIndex: undefined, row: [ 0, 0, 0, 0, 0, 0, 0, 0 ]});
    }
    this.setState({
      sequence: sequence
    });
    var loadedSequence = this.state.savedSequences[index];
    var loadedSequenceRows = loadedSequence.sequenceRows;
    for (var i = 0; i < loadedSequenceRows.length; i++) {
      if (i === sequence.length) {
        //no more room to load a sequence row
        break;
      }
      var sampleIndex = undefined;
      if (loadedSequenceRows[i]['beat'] !== undefined) {
        //look for beat's index in this.state.samples
        var foundSampleArray = this.state.samples.filter((eachsample) => {
          return eachsample.name === loadedSequenceRows[i]['beat'];
        });
        if (foundSampleArray.length > 0) {
          sampleIndex = foundSampleArray[0].sampleId;
        }
      }
      if (sampleIndex !== undefined) {
        sequence[i].sampleIndex = sampleIndex;
        sequence[i].row = loadedSequenceRows[i].row;
      }
    }
    this.setState({
      sequence: sequence
    });
  }

  /**load shared song if this is a shareable link
  * users/:username/:sequenceObjID
  */
  loadSharedSequence() {
    return axios.get('/users/sharedObjID',
        {params: {
          username: this.props.username,
          sequenceObjID: this.props.sequenceObjID
        }}
      )
      .then((res) => {
        console.log('successful get shared sequence', res.data);
        var sharedSeq = res.data;
        this.setState({
          savedSequences: [sharedSeq]
        });
        return sharedSeq;
      })
      .then(() => {
        this.loadSavedSequence(0);
        return true;
      })
      .catch((err) => {
        console.log('error during load shared sequence', err);
      });
  }

  /** Save current sequence on the page
  * to look like this in the database
  * {
  *  user: 'MyUserName',
  *  sequenceRows:
  *    [
  *      {beat: 'blah', row: [0, 0, 0, 0, 0, 0, 0, 0]},
  *      {beat: 'blah2', row: [0, 0, 0, 0, 0, 0, 0, 0]},
  *      {beat: 'blah3', row: [0, 0, 0, 0, 0, 0, 0, 0]},
  *      {beat: 'blah4', row: [0, 0, 0, 0, 0, 0, 0, 0]}
  *    ]
  * }
  */
  saveSequence() {
    var sequenceRows = [];
    for (var i = 0; i < this.state.sequence.length; i++) {
      if (this.state.sequence[i].sampleIndex !== undefined) {
        var matchedSample;
        var matchedSampleArray = this.state.samples.filter((eachsample)=>{
          return eachsample.sampleId === this.state.sequence[i].sampleIndex;
        });
        if (matchedSampleArray.length > 0) {
          matchedSample = matchedSampleArray[0];
          sequenceRows.push({beat: matchedSample.name, row: this.state.sequence[i].row});
        }
      }
    }
    var sequenceObj = {user: this.state.username, sequenceRows: sequenceRows};
    return axios.post('/users', {sequenceObj: sequenceObj})
      .then((res) => {
        return this.getSavedSequences(this.state.username);
      })
      .catch((err) => {
        console.log('error during save sequence', err);
        throw err;
      });
  }

  /** Clicking the play button will toggle between play and pause
  change play visualizer to visible+moving if was stopped
   change play visualizer to moving if was paused
  Run Main callback to "play"
  play sounds starting from time 0 OR last pause (Assume that Main component keeps track of last time)
  */

  playClicked() {
    if (this.state.loopButton) {
      this.setState({
        playstatus: true
      });
    }


    this.playSequence();
    if (this.state.loopButton) {
      this.state.intervalId = setInterval(()=>{
        this.playSequence();
      }, (60/this.state.bpm*1000)*8);

    }
    //this.props.playCB();
  }

  /** Clicking the pause button will toggle between play and pause
  //Make the play visualizer still visible but stop moving/animating
  Run Main callback to "pause"
  pause play at timeX at the Main component level */

  /** Clicking the stop button will stops the sound
    change the play button image to triangle button
    change play visualizer to invisible and not moving
    Leave loop button alone
  */
  stopClicked() {
    // this.updatePlay(false);
    this.setState({
      playstatus: false
    });
    clearInterval(this.state.intervalId);
    //this.props.stopCB();
  }


  /** Clicking the loop button will toggle between on or off (CURRENTLY NOT WORKING)
    Run Main callback to toggle looping
  */
  loopClicked() {
    // this.updatePlay(false);
    this.setState({
      loopButton: !this.state.loopButton
    });
    if (this.state.playstatus) this.state.playstatus = !this.state.playstatus;
    if (this.state.loopButton) {
      clearInterval(this.state.intervalId);
    }
    //this.props.toggleLoop();
  }
  /**When the save button is clicked
    Run Main callback to "save"
  */
  saveClicked() {
    //this.props.save();
    console.log('Save Clicked');
    this.saveSequence();
  }
  /**When the share button is clicked
    Run Main callback to "share"
  */
  shareClicked(index) {
    //this.props.share();
    console.log('Share Clicked');
    return axios.get('/users/share',
        {params: {
          username: this.state.username,
          sequenceObjID: JSON.parse(JSON.stringify(this.state.savedSequences[index]._id))
        }}
      )
      .then((res) => {
        console.log('successful sharing of sequence');
        return true;
      })
      .then(() => {
        return this.getSavedSequences(this.state.username);
      })
      .catch((err) => {
        console.log('error during sharing of sequence', err);
        throw err;
      });
  }
  /** Plays current sequence. If loop is true, then play with interval.

  */
  playSequence() {
    this.state.sequence.forEach((sequence, sequenceIndex) => {
      if (sequence.sampleIndex !== undefined) {
        sequence.row.forEach((item, rowIndex) => {
          if (item === 1) {
            setTimeout( () => {
              this.state.samples[this.state.sequence[sequenceIndex].sampleIndex].play();
            }, (60 / this.state.bpm * 1000) * rowIndex);
          }
        });
      }
    });
  }
  /** changes bpm of the sequence. takes number between 60-999

  */
  changeBPM () {
    console.log("Change BPM Clicked ", document.getElementById('bpm').value);
    var bpm = document.getElementById('bpm').value;
    if ( 60 <=bpm && bpm<=999 ) {
      this.setState({
        bpm: bpm,
        playstatus: !this.state.playstatus,
        loopButton: !this.state.loopButton
      });
      clearInterval(this.state.intervalId);
      this.stopClicked();
    } else {
      alert('BPM should be between 60 and 999');
    }
  }


  render() {

    var welcomeUsername = this.props.loggedIn &&
      <div>Welcome {this.state.username}</div>;
    return(
    <div id="container">
      <NaviBar
        loggedIn={this.props.loggedIn}
        loginCB={this.loginCB}
        creatAcctCB={this.createAcctCB}
        logoutCB={this.logoutCB}
      />
      {welcomeUsername}
      <SampleLibrary
        beatToRegister={this.state.beatToRegister}
        samples={this.state.samples}
        playSample={this.playSampleFromLibrary}
        registerSample={this.addSampleToBoard}
        samplesOnTheBoard={this.state.sequence.map(sample => sample.sampleIndex)}

      />
<<<<<<< HEAD
=======
=======
>>>>>>> d4cef92d1d77b35691ebe0a9959b6657a7fd877e


    return(
    <div id="container">
      <NaviBar loggedIn={this.props.loggedIn} loginCB={this.loginCB.bind(this)} creatAcctCB={this.createAcctCB.bind(this)} logoutCB={this.logoutCB.bind(this)}/>
      <SampleLibrary beatToRegister={this.state.beatToRegister} samples={this.state.samples} sampleClick={this.playSampleFromLibrary} doubleClick={this.sampleDoubleClickHandler} />
      <ControlPanel
        bpm={this.state.bpm}
        loopButton={this.state.loopButton}
        playstatus={this.state.playstatus}
        loggedIn={this.props.loggedIn}
        samples={this.state.samples}
        playClicked={this.playClicked}
        stopClicked={this.stopClicked}
        loopClicked={this.loopClicked}
        saveClicked={this.saveClicked}
        shareClicked={this.shareClicked}
        changeBPM={this.changeBPM}
      />

      <SoundBoard
        samples={this.state.samples}
        sequence={this.state.sequence}
        toggleCell={this.toggleSoundOnBoard}
        removeSample={this.removeSampleFromBoard}
      />

      <SavedSequences
        savedSequences={this.state.savedSequences}
        loadSavedSequence = {this.loadSavedSequence}
        shareClicked = {this.shareClicked}
        loggedIn={this.props.loggedIn}
      />
    </div> )
  }
}


const Routes = () => (
  <Router>
  <Switch>
    <Route exact path="/" render={() => <Main loggedIn={false}/>}/>
    <Route exact path="/member" render={() => <Main loggedIn={true}/>}/>
    <Route exact path="/users/:username/:sequenceObjID" render={(props) => <Main loggedIn={false} username={props.match.params.username} sequenceObjID={props.match.params.sequenceObjID}/>}/>
  </Switch>
</Router> )


export default Main;
