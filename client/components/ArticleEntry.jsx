// ArticleEntry component (i.e., indiv. Article Entry)
  // - stateful component

import React from 'react';
import {FormControl, FormGroup} from 'react-bootstrap';

const voices = [
	{id: 1, name: 'Big Daddy'},
	{id: 2, name: 'Mama'},
	{id: 3, name: 'Little Brother'},
	{id: 4, name: 'Kid Sister'}
];

const makeVoiceMenu = function(voices) {
	return(
		<div className="voice-chooser">
			<FormGroup controlId="voiceSelect">
	      <FormControl componentClass="select" placeholder="Voice Choice">
	      <option>Voice Choice</option>
	      {voices.map((voice,i) => (
					<option key={i} value={voice.id} >{voice.name}</option>
					))}
	      </FormControl>
	    </FormGroup>
		</div>
	);
};

const voiceMenu = makeVoiceMenu(voices);

function ArticleEntry({article, deleteIt}) {
	const articleText = article.text;

	// ShowInfo component shows body of parsed article text when 'More Info' button is clicked (only console.logs for now)
	function ShowInfo() {
		console.log('article: ', article);
		// console.log(articleText);
	}

  // removed time -- to add it back, just append this =>  + ' @ ' + entry.slice(11,16)
	function cleanTime(entry) {
		return !entry ? 'N/A' : (entry.slice(5,7) + '/' + entry.slice(8,10) + '/' + entry.slice(0,4));
  }

	return (
	  <div className="list-group-item article-entry">
	  	{article.title && <div className="article-title"><span>Title: </span><span><a href={article.url}>{article.title}</a></span></div>}
	  	{article.author && <div className="article-author"><span>Author: </span><span>{article.author}</span></div>}
	  	{article.publication_date && <div className="article-publishDate"><span>Date: </span><span>{cleanTime(article.publication_date)}</span></div>}
	  	{article.source_name && <div className="article-source"><span>Source: </span><span>{article.source_name}</span></div>}
	  	{article.image && <img className="article-sampleImage" src={article.image} height="42" />}
	  	{article.excerpt && <div className="article-excerpt"><span>Excerpt: </span><span>{article.excerpt}</span></div>}
			{article.title && <button onClick={ShowInfo}>More Infooooo</button>}
			{article.title && <button onClick={() => deleteIt(article.url)}>Delete</button>}
			{voiceMenu}
	  	{/*article.title &&<hr/>*/}
	  </div>
	);
	// return (
	//   <div className="article-entry">
	//   	<div className="article-title"><span>Title: </span><span><a href={article.url}>{article.title}</a></span></div>
	//   	<div className="article-author"><span>Author: </span><span>{article.author || 'N/A'}</span></div>
	//   	<div className="article-publishDate"><span>Date: </span><span>{cleanTime(article.publication_date)}</span></div>
	//   	<div className="article-source"><span>Source: </span><span>{article.source_name || 'Confidential'}</span></div>
	//   	<img className="article-sampleImage" src={article.image} height="42" />
	//   	<div className="article-excerpt"><span>Excerpt: </span><span>{article.excerpt}</span></div>
	// 		<button onClick={ShowInfo}>More Infooooo</button>
	// 		<button onClick={() => deleteIt(article.url)}>Delete</button>
	//   	<hr/>
	//   </div>
	// );
}

export default ArticleEntry;

