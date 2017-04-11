// TransFormEr component
	// (component where users enter links, in a form, to have them 'transformed')

import React from 'react';
import {Button, Col, ControlLabel, Form, FormControl, FormGroup, Row} from 'react-bootstrap';


class TransFormEr extends React.Component {
	constructor(props) {
		super(props);
		this.state = {value: ''};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({value: event.target.value});
	}

	handleSubmit(event) {
		console.log('VALUE === ', this.state.value)
		event.preventDefault();
		this.props.postIt(this.state.value);
		this.setState({value: ''});
	}

	render() {
		return (
		<Row className="transformer">
		<Col md={8} mdOffset={2}>
			<Form inline onSubmit={this.handleSubmit}>
				<FormGroup controlId="urlConverter">
					<FormControl className="urlInput" type="text" placeholder="Enter an article URL" value={this.state.value} onChange={this.handleChange} />
				</FormGroup>{' '}{' '}
				<Button type="submit" bsStyle="success">Listen now</Button>{' '}
				<Button type="submit" bsStyle="primary">Add to library</Button>
				<hr/>
			</Form>
		</Col>
		</Row>
		);
	}
	// => TODO: write function & connect Listen now button to process URL & begin playing when available; 

	// render() {
	// 	return (
	// 		<form class="transformer" onSubmit={this.handleSubmit}>
	// 			<label>
	// 				Enter Link:
	// 				<input className="transformer-input" type="text" size="120" value={this.state.value} onChange={this.handleChange} />
	// 			</label>
	// 			<input type="submit" value="Convert it" />
	// 			<hr/>
	// 		</form>
	// 	);
	// }
}

export default TransFormEr;
