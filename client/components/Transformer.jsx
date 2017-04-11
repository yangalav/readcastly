// TransFormEr component
	// (component where users enter links, in a form, to have them 'transformed')

import React from 'react';
import { Grid, Row, Col, Form, FormControl, FormGroup, InputGroup, Button } from 'react-bootstrap';


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
			<Grid>
				<Row className="transformer">
					<Form inline onSubmit={this.handleSubmit}>
						<Col md={10}>
							<FormControl type="text" id="add-library-input" placeholder="Enter URL ..." value={this.state.value} onChange={this.handleChange} />
						</Col>
						<Col md={2}>
					    <Button type="submit" bsStyle="warning" id="add-library-btn">Add to Library</Button>
						</Col>
						</Form>
						<hr/>
				</Row>
			</Grid>
		);
	}
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
