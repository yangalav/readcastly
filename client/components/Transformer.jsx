// TransFormEr component
	// (component where users enter links, in a form, to have them 'transformed')

import React from 'react';

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
		event.preventDefault();
		this.props.postIt(this.state.value);
		this.setState({value: ''});		
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					Enter Link: 
					<input className="transformer-input" type="text" size="120" value={this.state.value} onChange={this.handleChange} />
				</label>
				<input type="submit" value="Convert it" />
				<hr/>
			</form>
		);
	}
}

export default TransFormEr;
