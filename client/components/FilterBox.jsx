import React from 'react';
// what to import from react-bootstrap?
import { Grid, Row, Col, Form, FormControl, FormGroup, InputGroup, Button } from 'react-bootstrap';

const log = console.log; /* MH-DEBUGGING */
const line = '================'; /* MH-DEBUGGING */

class FilterBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {value: ''};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		log(line, 'inside FilterBox -- handleChange: event.target.value: ', event.target.value)
		this.setState({value: event.target.value});
	}
	handleSubmit(event) {
		this.props.toggleLoading();
		console.log(line, 'inside FilterBox -- handleSubmit: this.state.value === ', this.state.value)
		event.preventDefault();
		// invokes searchForIt method (passed down from App Component) on user's search input
		this.props.searchForIt(this.state.value);
		this.setState({value: ''});
	}

	render() {
		return(
			<Form onSubmit={!this.props.isLoading ? this.handleSubmit : null}>
				<Col sm={4} smOffset={2} xs={6}>
					<FormControl type="text" id="search-library" placeholder="Search your articles..." value={this.state.value} onChange={this.handleChange} />
				</Col>
				<Col sm={2} xs={6}>
					<Button type="submit" bsStyle="primary btn-block" id="search-library-btn" onClick={this.handleSubmit} disabled={this.props.isLoading}>{this.props.isLoading ? 'Loading...' : 'Filter'}</Button>
					{this.props.isFiltered && <Button bsStyle="default" onClick={this.props.showAll.bind(this)} disabled={this.props.isLoading}>Show All</Button>}
				</Col>
			</Form>
		);
	}
}

export default FilterBox;



// <<<<<<<<<<<<<<<<<<<<
	// TODO: move into App.jsx

// App Component, inside render method
// <FilterBox searchForIt={this.filterArticles.bind(this)} isLoading={this.state.isLoading} toggleLoading={this.toggleLoading.bind(this)} } />

// TODO: ---------------Drop this in (with mods)
// Readcast vs Top stories selector component

// import React from 'react';
// import Switch from 'react-bootstrap-switch';
// import { Button, Col } from 'react-bootstrap';

// <<<<<<<<<<<<<<<<<<<<
