// TransFormEr component
	// (component where users enter links, in a form, to have them 'transformed')

import React from 'react';
import { Grid, Row, Col, Form, FormControl, FormGroup, InputGroup, Button } from 'react-bootstrap';

class TransFormEr extends React.Component {
	constructor(props) {
		super(props);
		this.state = {value: ''};

		this.handleChange = this.handleChange.bind(this);
		this.addOne = this.addOne.bind(this);
	}

	handleChange(event) {
		this.setState({value: event.target.value});
	}

	addOne(event) {
		this.props.toggleLoading();
		console.log('VALUE === ', this.state.value)
		event.preventDefault();
		this.props.postIt(this.state.value);
		this.setState({value: ''});
	}

	streamIt() {
		this.props.quickStream(this.state.value);
		this.setState({value: ''});
	}

	render() {
		return (
			<Grid>
						{/*<hr/>*/}
				<Row className="transformer">
					<Form inline onSubmit={!this.props.isLoading ? this.streamIt.bind(this) : null}>
						<Col md={this.props.isGuest ? 10 : 8}>
							<FormControl type="text" id="add-library-input" placeholder="Enter an article URL" value={this.state.value} onChange={this.handleChange} onSubmit={!this.props.isLoading ? this.streamIt.bind(this) : null} required/>
						</Col>
						<Col md={2}>
					    <Button type="submit" bsStyle="warning" id="listen-now-btn" onClick={!this.props.isLoading ? this.streamIt.bind(this) : null}>Listen now</Button>
						</Col>
					</Form>
            <Col md={2}>
							{!this.props.isGuest && <Button type="submit" bsStyle="warning" id="add-library-btn" onClick={this.state.value === '' ? null : this.addOne} >Add to Library</Button>}
						</Col>
				</Row>
			</Grid>
		);
	}
	// => TODO: write function & connect Listen now button to process URL & begin playing when available;
        //  => app.jsx line 214: this.setState({nowPlaying: {url: res.data.url, title: res.data.title}});
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
