import React from 'react';

var Cell = (props) => {
  return (
  	<div
  		style={{'textAlign':'center'}}
      className="col-xs-4 col-md-1 bg-info" 
      onClick={ () => { props.toggleCell(props.rowIndex, props.colIndex) }}
    >
      {props.cell}
    </div>
  );
};

export default Cell;
