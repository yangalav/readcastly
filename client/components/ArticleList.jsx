// ArticleList component (i.e., the container for Articles)
  // - a stateless component

import React from 'react';
import {Row} from 'react-bootstrap';
import ArticleEntry from './ArticleEntry.jsx';

function ArticleList(props) {
	const articles = props.articles;
	return (
		<Row className='list-group article-list'>
			{articles.map((article) => (
				<ArticleEntry key={article.id} article={article} deleteIt={props.deleteIt} convertIt={props.convertIt}/>
			))}
		</Row>
	);
}

export default ArticleList;