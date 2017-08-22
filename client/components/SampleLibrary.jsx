import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';


var SampleLibrary = (props) => {
  var green = props.samplesOnTheBoard[0];
  var red = props.samplesOnTheBoard[1];
  var blue = props.samplesOnTheBoard[2];
  var yellow = props.samplesOnTheBoard[3];

  return (
    <Grid style={{marginBottom: '60px'}}>
      <Row className="show-grid">
        <Col xs={12} sm={8} smOffset={2} sm={6} smOffset={3} className={'center'}>
        {
          props.samples.map( (sound, index) => {
            return (
              <div key={index} >
                <Col
                  xs={3}
                >
                  <Button
                    bsStyle="default"
                    className={
                      green === index ? "green greenPulse btnPulseOnce sampleLibraryBtn" :
                      blue === index ? "blue bluePulse btnPulseOnce sampleLibraryBtn" :
                      red === index ? "red redPulse btnPulseOnce sampleLibraryBtn" :
                      yellow === index ? "yellow yellowPulse btnPulseOnce btnPulseOnce sampleLibraryBtn" :
                      "sampleLibraryBtn"
                    }
                    onClick={() => {
                      props.playSample(index)

                    }}
                    onDoubleClick={() => {props.registerSample(index)}}>
                  </Button>
                  <div className={'center, whiteFont'}>{sound.name.toUpperCase()}</div>

                </Col>
              </div>
            )
          })
        }
      </Col>
      </Row>
    </Grid>
  );
};

export default SampleLibrary;
