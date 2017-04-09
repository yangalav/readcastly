// ArticleEntry component (i.e., indiv. Article Entry)
  // - stateful component

import React from 'react';
import {Button, Col, FormControl, FormGroup} from 'react-bootstrap';

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
	      {voices.map((voice,i) => (
					<option key={i} value={voice.id} >{voice.name}</option>
					))}
	      </FormControl>
	    </FormGroup>
		</div>
	);
};

const voiceMenu = makeVoiceMenu(voices);

const exportOptions = [
	{id: 1, method: 'Stream It'},
	{id: 2, method: 'Email It'},
	{id: 3, method: 'Text It'}
];

const makeExportMenu = function(methods) {
	return(
		<div className="conversion-chooser">
			<FormGroup controlId="conversionSelect">
	      <FormControl componentClass="select" placeholder="File Options">
	      {exportOptions.map((option,i) => (
					<option key={i} value={option.id} >{option.method}</option>
					))}
	      </FormControl>
	    </FormGroup>
		</div>
	);
};

const exportMenu = makeExportMenu(exportOptions);


function ArticleEntry({article, deleteIt, convertIt}) {
	const articleText = article.text;

	// ShowInfo component shows body of parsed article text when 'More Info' button is clicked (only console.logs for now)
	function ShowInfo() {
		console.log('article: ', article);
		// console.log(articleText);
	}

	function Export(voiceSelect.value,conversionSelect.value) {
		//make object with arguments and article attributes and invoke convertIt;
	}

  // removed time -- to add it back, just append this =>  + ' @ ' + entry.slice(11,16)
	function cleanTime(entry) {
		return !entry ? 'N/A' : (entry.slice(5,7) + '/' + entry.slice(8,10) + '/' + entry.slice(0,4));
  }

	return (
	  <Col md={8} mdOffset={2} className="list-group-item article-entry">
	  	{article.title && <div className="article-title"><span>Title: </span><span><a href={article.url}>{article.title}</a></span></div>}
	  	{article.author && <div className="article-author"><span>Author: </span><span>{article.author}</span></div>}
	  	{article.publication_date && <div className="article-publishDate"><span>Date: </span><span>{cleanTime(article.publication_date)}</span></div>}
	  	{article.source_name && <div className="article-source"><span>Source: </span><span>{article.source_name}</span></div>}
	  	{article.image && <img className="article-sampleImage" src={article.image} height="42" />}
	  	{article.excerpt && <div className="article-excerpt"><span>Excerpt: </span><span>{article.excerpt}</span></div>}
			{article.title && voiceMenu}
			{article.title && exportMenu}
			{article.title && <Button bsStyle="primary" onClick={ShowInfo}>Read to Me</Button>}
			{article.title && <Button bsStyle="danger" onClick={() => deleteIt(article.url)}>Remove From Library</Button>}
	  	{/*article.title &&<hr/>*/}
	  </Col>
	);

// {article.title && <Button bsStyle="primary" onClick={Export}>Read to Me</Button>}

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

