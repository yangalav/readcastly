// Subtitle component
import React from 'react';

export default function Subtitle(props) {
	return (<h4 className="subtitle" getCurrentUser={props.getCurrentUser}>{props.subtitle} Welcome { props.user.first_name }</h4>);
}
