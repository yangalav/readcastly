
import React from 'react';

// SUBCOMPONENTS below (incl: Title, Transformer, ArticleList, ArticleEntry)
// will later be separated into their own modules/files

// Title component
function Title(props) {
	return (<h1>Hello, Readcast.ly!</h1>);
}

// Transformer component (i.e., where users enter links, to have them transformed)
function Transformer(props) {
	// =>TODO: button needs onClick attribute, which needs method that handles state
	return (
		<div>
			<input type="text" value=""/>
			<button>Convert It</button>
			<hr/>
		</div>
	);
}

// ArticleList component (i.e., the container for Articles)
function ArticleList(props) {
	// Note: This is hard-coded for now
	// =>TODO: replace code below with code that dynamically iterates over user's article list from server
	const articles = [];
	for (let i = 0; i < 5; i++) {
		articles.push(<ArticleEntry/>);
	}
	return (
		<div className='article-list'>
			{articles}
		</div>
	);
}

// ArticleEntry component (i.e., indiv. Article Entry)
function ArticleEntry(props) {
	// =>TODO: replace hard-coded values below with dynamically generated ones
	const title = "Who is ‘Source D’? The man said to be behind the Trump-Russia dossier’s most salacious claim.";
	const author = 'Bob Woodward';
	const publishDate = "2017-03-29T11:32:00.000Z";
	const sampleImage = "https://img.washingtonpost.com/rf/image_1484w/2010-2019/WashingtonPost/2017/03/20/National-Politics/Images/AP_59952768667.jpg";
	const source = "www.washingtonpost.com";
	const excerpt = "The story of Sergei Millian illustrates the challenge confronting the FBI as it seeks to separate fact from fiction.";

	return (
	  <div className="article-entry">
	  	<div className="article-title"><span>Title: </span><span>{title}</span></div>
	  	<div className="article-author"><span>Author: </span><span>{author}</span></div>
	  	<div className="article-publishDate"><span>Date: </span><span>{publishDate}</span></div>
	  	<div className="article-source"><span>Source: </span><span>{source}</span></div>
	  	<img className="article-sampleImage" src={sampleImage} height="42" />
	  	<div className="article-excerpt"><span>Excerpt: </span><span>{excerpt}</span></div>
			<button>More Info</button>
	  	<hr/>
	  </div>
	);
}

// 'APP' is a stateful top-level component; it will stay in this file
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// =>TODO: FILL-IN keys: values
		};
		// =>TODO: handle 'this' binding
	}
	// =>TODO: App methods go here

	render() {

		return(
			<div>
				<Title />
				<Transformer />
				<ArticleList />
			</div>
		);
	}
}

export default App;
