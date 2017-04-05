// 'APP' component is a stateful, top-level component

import React from 'react';
import axios from 'axios';
import Title from './Title';
import TransFormEr from './TransFormEr';
import ArticleList from './ArticleList';
import ArticleEntry from './ArticleEntry';
import isValidUrl from '../helpers/urlValidation';


class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			hasErrored: false,
			isLoading: false
		};
	}

	getReadingList(route) {
		this.setState({ isLoading: true });
		axios.get(route)
			.then((res) => {
				this.setState({ isLoading: false });
				return res.data.reverse();
			})
			.then((items) => this.setState({items}))
			.catch((err) => this.setState({ hasErrored: true }));
	}

	postUserLink(url) {
		// =>TODO: validate user inputs, correct any formatting issues
		this.setState({ isLoading: true });
		axios.post('/reqUrl', {requrl: url})
		.then((res) => {
			this.setState({ isLoading: false });
			return res.data.reverse();
		})
		.then((items) => this.setState({items}))
		.catch((err) => this.setState({ hasErrored: true }));
	}

	deleteArticle(id) {
		console.log('App-L46-inside deleteArticle with id: ', id);
		this.setState({ isLoading: true });		
		axios.delete('/deleteOne', { articleUser_id: id })
		.then((res) => {
			this.setState({ isLoading: false });
			// => TODO: figure out how to alert user that article was deleted
			console.log('App-L50-Article was deleted: ', res);
			this.getReadingList('/getAll');
		})
		.catch((err) => this.setState({ hasErrored: true }));
	}

	// make AJAX call to fetch data for the ArticleList component
	componentDidMount() {
		this.getReadingList('getAll/');
	}

	render() {

		if (this.state.hasErrored) {
			return <p>There was an error when loading the articles</p>; // when we get this we should re-render the original page, as currently it just dies here (blank screen + this message)
		}

		if (this.state.isLoading) {
			return (
				<div>
					<p>Loading...</p>
					<img className="spinner" src='./../images/spiffygif_46x46.gif' height="42" />
				</div>
			);
		}

		return(
			<div>
				<Title title='Hello, ReadCast.ly!'/>
				<TransFormEr postIt={this.postUserLink.bind(this)}/>
				<ArticleList articles={this.state.items} deleteIt={this.deleteArticle.bind(this)}/>
			</div>
		);
	}
}

export default App;
