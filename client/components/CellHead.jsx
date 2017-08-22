import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

var CellHead = (props) => {
	var name;
	var remove;
	var inLineStyle = {'textAlign':'center'};
	if (props.sample) {
		name = props.sample.name;
		remove = <Glyphicon glyph="remove-circle" onClick={ () => {props.unregisterSample(props.rowIndex)}}/>
	}
	return (
		<div
			className="col-xs-4 col-lg-4 bg-success" style={inLineStyle}
		>
			{props.sample ? name : 'Register Sound'}
			{remove}
		</div>
	)

}

export default CellHead;
