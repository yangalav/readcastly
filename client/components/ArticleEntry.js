// ArticleEntry component (i.e., indiv. Article Entry)

import React from 'react';


function ArticleEntry({article, deleteIt}) {
	// const articleText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	const articleText = article.text;
	// const article = props.article;
	// const id = props.article.id;

	// ShowInfo component shows body of parsed article text when 'More Info' button is clicked
	// (only console.logs for now)
	function ShowInfo() {
		console.log('article: ', article);		
		// console.log(articleText);
	}

	// function deleteArticle() {
	// 	console.log('deleting article with id# ', id);
	// 	props.deleteIt(id);
	// }

	return (
	  <div className="article-entry">
	  	<div className="article-title"><span>Title: </span><span><a href={article.url}>{article.title}</a></span></div>
	  	<div className="article-author"><span>Author: </span><span>{article.author}</span></div>
	  	<div className="article-publishDate"><span>Date: </span><span>{article.publication_date}</span></div>
	  	<div className="article-source"><span>Source: </span><span>{article.source_name || article.source_id}</span></div>
	  	<img className="article-sampleImage" src={article.image} height="42" />
	  	<div className="article-excerpt"><span>Excerpt: </span><span>{article.excerpt}</span></div>
			<button onClick={ShowInfo}>More Infooooo</button>
			<button onClick={() => deleteIt(article.id)}>Delete</button>			
	  	<hr/>
	  </div>
	);
}

export default ArticleEntry;

// 		2017-04-03T04:00:00.000Z