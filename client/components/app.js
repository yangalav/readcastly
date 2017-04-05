// 'APP' component is a stateful, top-level component

import React from 'react';
import axios from 'axios';
import Title from './Title';
// import SignupButton from './SignupButton';
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
			isLoading: false,
			failMessage: ''
		};
	}

	getReadingList(route) {
		this.setState({ isLoading: true });
		axios.get(route)
			.then((res) => {
				// console.log('APP-L-27 - res.data ***: ', res.data);
				this.setState({ isLoading: false });
				return res.data.reverse();
			})
			.then((items) => this.setState({items}))
			.catch((err) => this.setState({ hasErrored: true, failMessage: 'Unable to retrieve articles' }));
	}

	addOne(obj) {
		let result = this.state.items;
		result.unshift(obj);
		return result;
	}

	postUserLink(url) {
		if (!isValidUrl(url)) {
			this.setState({hasErrored: true, failMessage: ('Not a valid url: ' + url)});
			return;
		}
		this.setState({ isLoading: true });
		axios.post('/requrl', {requrl: url})
		.then((res) => {
			console.log('APP-L-43 - res.data ***: ', res.data);
			this.setState({ isLoading: false, items: (this.addOne(res.data)) });
			// this.setState({ isLoading: false });
			return this.state.items;
			// return res.data.reverse();
		})
		// .then((items) => this.setState({items}))
		.catch((err) => this.setState({ hasErrored: true, failMessage: 'Unable to fetch that link' }));
	}

	deleteArticle(id) {
		console.log('App-L46-inside deleteArticle with id: ', id);
		this.setState({ isLoading: true });
		axios.post('/deleteOne', { articleUser_id: id })
		.then((res) => {
			this.setState({ isLoading: false });
			// => TODO: figure out how to alert user that article was deleted
			console.log('App-L50-Article was deleted: ', res);
			this.getReadingList('/getAll');
		})
		.catch((err) => this.setState({ hasErrored: true, failMessage: 'Unable to delete that article' }));
	}

	// make ajax call to fetch data for the ArticleList component
	componentDidMount() {
		this.getReadingList('getAll/');
	}

	render() {

		// => FIXIT: when we get this we should re-render the original page, as currently it just dies here (blank screen + this message)
		if (this.state.hasErrored) {
			return (
				<div>
					<p>There was an error when loading the data</p>
					<p>{this.state.failMessage}</p>
				</div>
			);
		}

		if (this.state.isLoading) {
			return (
				<div>
				  <Title title='Hello, ReadCast.ly!'/>
					<TransFormEr postIt={this.postUserLink.bind(this)}/>
					<p>Loading...</p>
					<img className="spinner" src='./../images/spiffygif_46x46.gif' height="42" />
				  <ArticleList articles={this.state.items} deleteIt={this.deleteArticle.bind(this)}/>
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
