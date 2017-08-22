import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

/** Control panel behavior
 * States:
 * Whether song is playing or paused or stopped
 * Whether play button is the triangle or pause symbol
 * //Whether play visualizer is visible or invisible
 * //Whether play visualizer is still or moving
 * Whether loop is toggled ON or OFF
 * @constructor
 */

var ControlPanel = (props) => {
  // console.log("PROPS", props);


  // var saveButton = <Button style={{display: 'inline'}}> Save </Button>;
  // var shareButton = <Button style={{display: 'inline'}}> Share </Button>;
  var saveButton = props.loggedIn &&
    <Button className="col-lg-12" bsStyle="primary" bsSize="large" active
      onClick={()=>{props.saveClicked()}}>save</Button>;
  var inLineStyle={"textAlign":'center', "height":40, "margin" : 'auto', "fontSize" : 20, "padding" : 5};
  return (
    <div className="container">
      <div className="row">
        <Button className="col-lg-2" bsStyle={props.playstatus ? "warning" : "primary" } bsSize="large" active
          onClick={()=>{props.playClicked()}}><Glyphicon glyph="play"/></Button>    
        <Button className="col-lg-2" bsStyle="primary" bsSize="large" active
          onClick={()=>{props.stopClicked()}}><Glyphicon glyph="stop"/></Button>
        <Button className="col-lg-2" bsStyle={props.loopButton? "warning" : "success"} bsSize="large" active
          onClick={()=>{props.loopClicked()}}><Glyphicon glyph="repeat"/></Button>
        <div className="col-lg-2 bg-warning" style={inLineStyle} >BPM {props.bpm}</div>
        <input className="col-lg-2" style={{height:40}}  id="bpm"  type="number" name="bpm" min="60" max="999" />
        <Button className="col-lg-2" style={{height:40}} bsStyle={"default"} bsSize="large" active
          onClick={()=>{props.changeBPM()}}>Update BPM</Button>
        {saveButton}
      </div>
    </div>
  );

};

export default ControlPanel;