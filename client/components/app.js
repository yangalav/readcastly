import React from 'react';
import axios from 'axios';

// SUBCOMPONENTS below (incl: Title, Transformer, ArticleList, ArticleEntry)
// will later be separated into their own modules/files

// Title component
function Title(props) {
	return (<h1>Hello, Readcast.ly!</h1>);
}

// Transformer component (i.e., where users enter links, to have them transformed)
class Transformer extends React.Component {
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
		console.log('A link was submitted: ', this.state.value);
		event.preventDefault();
		// call another method that sends info
	}

	// =>TODO: complete the handling of user input
	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					Enter Link: 
					<input type="text" value={this.state.value} onChange={this.handleChange} />
				</label>
				<input type="submit" value="Convert it" />
				<hr/>
			</form>
		);
	}
}

// ArticleList component (i.e., the container for Articles)
function ArticleList(props) {
	const articles = props.articles;
	return (
		<div className='article-list'>
			{articles.map((article) => (
				<ArticleEntry key={article.id} article={article}/>
			))}	
		</div>
	);
}
 
// ArticleEntry component (i.e., indiv. Article Entry)
function ArticleEntry(props) {	
	// const articleText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	const articleText = props.article.text;
	const article = props.article;

	// ShowInfo component shows body of parsed article text when 'More Info' button is clicked
	// (only console.logs for now)
	function ShowInfo() {
		console.log(articleText);
	}

	return (
	  <div className="article-entry">
	  	<div className="article-title"><span>Title: </span><span>{article.title}</span></div>
	  	<div className="article-author"><span>Author: </span><span>{article.author}</span></div>
	  	<div className="article-publishDate"><span>Date: </span><span>{article.publication_date}</span></div>
	  	<div className="article-source"><span>Source: </span><span>{article.source_id}</span></div>
	  	<img className="article-sampleImage" src={article.image} height="42" />
	  	<div className="article-excerpt"><span>Excerpt: </span><span>{article.excerpt}</span></div>
			<button onClick={ShowInfo}>More Infooooo</button>	  	
	  	<hr/>
	  </div>
	);
}

// 'APP' is a stateful top-level component; it will stay in this file
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			hasErrored: false,
			isLoading: false
		};
		// =>TODO: handle 'this' binding (?)
	}
	getReadingList(route) {
		console.log('APP-L138-inside-getReadingList');
		this.setState({ isLoading: true });
		axios.get(route)
			.then((res) => {
				console.log('App-L142-res.data: ', res.data);
				this.setState({ isLoading: false });
				return res.data;
			})
			.then((items) => this.setState({items}))
			.catch((err) => this.setState({ hasErrored: true }));
	}

	// 	// getUserArticle(input) {
	// 	// take user input and clean it up
	// 	// make http post request to server, to /requrl endpoint, attaching input url to req.body.requrl
	// 	// invoke callback when response comes back from server
	postLink(url) {
		axios.post('/reqUrl', {requrl: url})
		// .then((res) => this.getReadingList('getAll/'))
		.then((res) => console.log('response received: ', res))
		.catch((err) => this.setState({ hasErrored: true }));
	}

	// make AJAX call to fetch data for the ArticleList component
	componentDidMount() {
		console.log('App-L155-inside-componentDidMount');
		this.getReadingList('getAll/'); 
	}

	render() {

		if (this.state.hasErrored) {
			return <p>There was an error when loading the articles</p>;
		}

		if (this.state.isLoading) {
			return <p>Loading...</p>
		}

		return(
			<div>
				<Title />
				<Transformer />
				<ArticleList articles={this.state.items}/>
			</div>
		);
	}
}

export default App;
