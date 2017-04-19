// Subtitle component
import React from 'react';

function Subtitle(props) {
	return (<h4 className="subtitle">{props.subtitle} Welcome { props.user.first_name }</h4>);
}

export default Subtitle;
