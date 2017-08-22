import React from 'react';
import Button from 'react-bootstrap/lib/Button';

var SavedSequences = (props) => {

  return (
    <div className="container savedSequences">{props.loggedIn ? 'Saved sequences...click ID# to load, click share button to share' : ''}
    <div>
      {
        props.savedSequences.map( (sequence, index) => {
          var linkOrShare = sequence.shareable ?
            (<a key={index} href={`/users/${sequence.user}/${sequence._id}`}>Shareable Link</a>) :
            (<Button key={index} bsStyle="primary" bsSize="small" onClick={()=>{props.shareClicked(index)}}>Share</Button>);
          return (
            <div>
              <span>
                {JSON.stringify(sequence._id)}
                <Button
                  key={index}
                  bsStyle="primary"
                  bsSize="small"
                  style={{margin: '10px 15px'}}
                  onClick={() => {props.loadSavedSequence(index)}}
                > Load
              </Button>
              </span>
              <span>
                {linkOrShare}
              </span>
            </div>
          )
        })
      }
    </div>
    </div>
  );
};

export default SavedSequences;
