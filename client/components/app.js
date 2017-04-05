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
			isLoading: false,
			failMessage: ''
		};	
	}
	
	getReadingList(route) {
		this.setState({ isLoading: true });
		axios.get(route)
			.then((res) => {
				// console.log('APP-L-27 - res.data ***: ', res.data);
				this.setState({ isLoading: false, items: (res.data.reverse()) });
				// return res.data.reverse();
			})
			// .then((items) => this.setState({items}))
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
			// console.log('APP-L-43 - res.data ***: ', res.data);
			this.setState({ isLoading: false, items: (this.addOne(res.data)) });	
		})	
		.catch((err) => this.setState({ hasErrored: true, failMessage: 'Unable to fetch that link' }));
	}

	findIndex(array, id) {
		// console.log('inside App-findIndex-L60, id: ', id);
		let found = false
		let index;
		let count = 0
		while (found === false) {
		  if (array[count].id === id) {
		    found = true;
		    index = count;
		  }
		  count++;
		}
		// console.log('inside App-findIndex-L71, index: ', index);
		return index;		
	}

	deleteOne(resObj) {
		// console.log('inside App-deleteOne-L76, resObj: ', resObj);
		let result = this.state.items;
		// console.log('L78-result: ', result);
		let index = this.findIndex(result, resObj.deleted);
		result.splice(index, 1);
		// console.log('inside App-deleteOne-L81, result: ', result);
		return result;
	}	

	deleteArticle(id) {
		// console.log('***********App-L81-inside deleteArticle with id: ', id);
		this.setState({ isLoading: true });		
		axios.post('/deleteOne', { articleUser_id: id })
		.then((res) => {
			// console.log('**********App-L85-Article was deleted -- res-data : ', res.data);
			this.setState({ isLoading: false, items: (this.deleteOne(res.data)) });
			// console.log('**********App-L92-State was updated?');
			// return res;
			// => TODO: figure out how to alert user that article was deleted
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
