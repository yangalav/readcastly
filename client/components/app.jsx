// {'APP' component is a stateful, top-level component }

import React from 'react';
import axios from 'axios';
import Title from './Title.jsx';
// {import SignupButton from './SignupButton'; }
import TransFormEr from './TransFormer.jsx';
import ArticleList from './ArticleList.jsx';
import ArticleEntry from './ArticleEntry.jsx';
import Player from './Player.jsx';
import isValidUrl from '../helpers/urlValidation.js';
import {Loading, ErrorAlert} from './Alerts.jsx';


class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			hasErrored: false,
			isLoading: false,
			failMessage: '',
			nowPlaying: {url: 'http://www.netprophet.net/charts/charts/Badfinger%20-%20No%20Matter%20What.mp3', title: 'No Matter What'}
		};
	}

	// {for getting entire article list}
	getReadingList(route) {
		this.setState({ isLoading: true });
		axios.get(route)
			.then((res) => {
				this.setState({ isLoading: false, items: (res.data.reverse()) });
			})
			.catch((err) => this.setState({ failMessage: (res.data.error || 'Unable to retrieve articles'), hasErrored: true }));
	}

// {helper function for postUserLink}
	addOne(obj) {
		let result = this.state.items;
		console.log(obj);
		result.unshift(obj);
		return result;
	}

// {for posting new links}
	postUserLink(url) {
		this.setState({hasErrored: false, failMessage: ''});
		if (!isValidUrl(url)) {
			this.setState({ failMessage: ('Not a valid url: ' + url), hasErrored: true });
			return;
		}
		this.setState({ isLoading: true });
		axios.post('/requrl', {requrl: url})
		.then((res) => {
			this.setState({ isLoading: false, items: (this.addOne(res.data)) });
			return;
		})
		.catch((err) => this.setState({ failMessage: (res.data.error || 'Unable to fetch that link'), hasErrored: true }));
	}

// {helper function for helper, deleteOne}
	findIndex(array, url) {
		let found = false
		let index;
		let count = 0
		while (found === false) {
			if (array[count].url === url) {
		    found = true;
		    index = count;
		  }
		  count++;
		}
		return index;
	}

// {helper function for deleteArticle}
	deleteOne(resObj) {
		let result = this.state.items;
		let index = this.findIndex(result, resObj.deleted);
		result.splice(index, 1);
		return result;
	}

// {for deleting a single article}
	deleteArticle(url) {
		// {this.setState({ isLoading: true });}
		axios.post('/deleteOne', { url: url })
		.then((res) => {
			this.setState({ isLoading: false, items: (this.deleteOne(res.data)) });
			// {=> TODO: figure out how to alert user that article was deleted}
		})
		.catch((err) => this.setState({ hasErrored: true, failMessage: (res.data.error ||'Unable to delete that article') }));
	}

	convertArticle(exportObject) {
		//title,author,date,source,text,voice,method
		//build object and post to conversion endpoint
		//if stream, when res comes in set state.nowPlaying to returned url
		//if text or e-mail when res comes in notify of success
	}



	// {invokes ajax call to fetch data for the ArticleList component}
	componentDidMount() {
		this.getReadingList('getAll/');
	}

	render() {

		return(
			<div>
				<Title title='Hello, ReadCast.ly!'/>
				{this.state.hasErrored && <ErrorAlert errorMessage={this.state.failMessage}/>}
				<TransFormEr postIt={this.postUserLink.bind(this)}/>
				{this.state.isLoading && <Loading />}
				<ArticleList articles={this.state.items} deleteIt={this.deleteArticle.bind(this)} convertIt={this.convertArticle.bind(this)/>
				<div id="player_container">
					<Player track={this.state.nowPlaying}/>
				</div>
			</div>
		);

		{/*// // => FIXIT: when we get this we should re-render the original page, as currently it just dies here (blank screen + this message)
		// if (this.state.hasErrored) {
		// 	return (
		// 		<div>
		// 			<p>There was an error when loading the data</p>
		// 			<p>{this.state.failMessage}</p>
		// 		</div>
		// 	);
		// }

		// if (this.state.isLoading) {
		// 	return (
		// 		<div>
		// 		  <Title title='Hello, ReadCast.ly!'/>
		// 			<TransFormEr postIt={this.postUserLink.bind(this)}/>
		// 			<p>Loading...</p>
		// 			<img className="spinner" src='./../images/spiffygif_46x46.gif' height="42" />
		// 		  <ArticleList articles={this.state.items} deleteIt={this.deleteArticle.bind(this)}/>
		// 		</div>
		// 	);
		// }

		// return(
		// 	<div>
		// 		<Title title='Hello, ReadCast.ly!'/>

		// 		<TransFormEr postIt={this.postUserLink.bind(this)}/>
		// 		<ArticleList articles={this.state.items} deleteIt={this.deleteArticle.bind(this)}/>
		// 	</div>
		// );*/}
	}
}

export default App;
