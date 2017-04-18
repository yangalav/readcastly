import React from 'react';
// what to import from react-bootstrap?
import { Grid, Row, Col, Form, FormControl, FormGroup, InputGroup, Button } from 'react-bootstrap';

class FilterBox extends React.Component {
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
		this.props.toggleLoading();
		console.log('FilterBox VALUE === ', this.state.value)
		event.preventDefault();
		// invokes searchForIt method (passed down from App Component) on user's search input
		this.props.searchForIt(this.state.value);
		this.setState({value: ''});
	}

	// upon user submit, a filter function takes search term(s) and filters through App library to render only those articles
	render() {
		return(
			<Form inline onSubmit={!this.props.isLoading ? this.handleSubmit : null}>
				<Col md={8}>
					<FormControl type="text" id="search-library" placeholder="Search your articles..." value={this.state.value} onChange={this.handleChange} />
				</Col>
        <Col md={4}>
					<Button type="submit" bsStyle="primary" id="search-library-btn" onClick={this.props.toggleFiltered.bind(this)} disabled={this.props.isLoading}>{this.props.isLoading ? 'Loading...' : 'Filter'}</Button>
					<Button bsStyle="default" onClick={this.props.toggleFiltered.bind(this)} disabled={this.props.isLoading}>All</Button>
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














