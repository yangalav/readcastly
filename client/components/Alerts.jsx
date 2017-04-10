// Alerts.js component includes various alerts to user

import React from 'react';

// Loading Component
export function Loading(props) {
	return(
		<div>
			<p>Loading...</p>
			<img className="spinner center-block" src='./../images/spiffygif_46x46.gif' height="42" />
		</div>
	);
}

// Error Component
export function ErrorAlert(props) {
	return (
		<div>
			{alert(props.errorMessage)}
		</div>
	);
}
// // Error Component
// export function ErrorAlert(props) {
// 	return (
// 		<div>
// 			<p>There was an error when loading the data</p>
// 			<p>{props.errorMessage}</p>
// 		</div>
// 	);
// }
