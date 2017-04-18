import React from 'react';
import { Grid, Row, Col, Form, FormControl, FormGroup, InputGroup, Button } from 'react-bootstrap';

class FilterBox extends React.Component {
	// constructor
	constructor(props) {
		super(props);
		this.state = {value: ''};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	// methods
	handleChange(event) {
		this.setState({value: event.target.value});
	}

	// method to listen for onChange event, and invoke method passed in from App.jsx
	handleSubmit(event) {
		this.props.toggleLoading();
		console.log('VALUE === ', this.state.value)
		event.preventDefault();
		// TODO: inherit a method from App to 
		// this.props.postIt(this.state.value);
		this.setState({value: ''});
	}

	// TODO: move this method up to App Component, and then pass it into props of FilterBox 
	filterArticles(userInput) {
		let target = new RegExp(userInput, 'i'); /* note: 'i' is a RegEx flag, not 'i' for 'index' */
		let lib = this.state.library;
		// ...filter through library for only those articles containing user search terms
		let filtered = lib.filter(function(article) {
			// ...for efficiency, check for match in title and excerpt before checking full article text
			if (target.test(article.title) || target.test(article.excerpt) || target.test(article.text)) { return article; }
		});
		(filtered) && this.setState({ isLoading: false, library: filtered })
	}

	// render
	render() {
		return(
			// TODO: insert jsx here
			// user enters search terms into input box
			// upon user submit, a filter function takes search term and filters through App library to render only those articles
		);
	}
}

export default FilterBox;














