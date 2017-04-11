// {'APP' component is a stateful, top-level component }

import React from 'react';
import axios from 'axios';

import Title from './Title.jsx';
import Subtitle from './Subtitle.jsx';
import WhichView from './ReadcastTopstories.jsx';
// import HeaderNavigation from './Navbar.jsx';
// {import SignupButton from './SignupButton'; }
import SignUpForm from './SignupForm.jsx';
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
			nowPlaying: {url: 'http://www.netprophet.net/charts/charts/Badfinger%20-%20No%20Matter%20What.mp3', title: 'No Matter What'},
			user:{
				id: 99
				// email:,
				// phone:,
				// first_name:,
				// voice_pref:,
				// avatar:,
			}
		};
	}

	// {for getting entire article list}
	getReadingList() {
		this.setState({ isLoading: true });
		axios.get('/getAll', {params: {userId: this.state.user.id} })
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
		axios.post('/requrl', {userId: this.state.user.id, requrl: url})
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
		axios.post('/deleteOne', { userId: this.state.user.id, url: url })
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
		this.getReadingList();
						// console.log('app.js getReadingList l 42. full db returned: ', res.data;
	}

	render() {

		return(
			<div>

		

				<Title title='Read.Cast.ly'/>
				<Subtitle subtitle='your reading backlog solved'/>
				{this.state.hasErrored && <ErrorAlert errorMessage={this.state.failMessage}/>}
				<TransFormEr postIt={this.postUserLink.bind(this)}/>
				{this.state.isLoading && <Loading />}
				<WhichView readcast='Your Read.casts'/>
				<ArticleList articles={this.state.items} deleteIt={this.deleteArticle.bind(this)} convertIt={this.convertArticle.bind(this)}/>
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

	// <ReadcastTopstories readcast='Your Read.casts'/>
	// => TODO: // get player scroll to work. Test text: Last word is "initially". This is a song by the legendary Badfinger, who were on Apple Records. Apple Computer told the Beatles they would never be in music so that settled the court case initially

					// <div id="navbar"></div>
