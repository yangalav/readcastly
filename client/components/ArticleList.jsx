// ArticleList component (i.e., the container for Articles)
  // - a stateless component

import React from 'react';
import ArticleEntry from './ArticleEntry.jsx';

function ArticleList(props) {
	const articles = props.articles;
	return (
		<div className='list-group article-list'>
			{articles.map((article) => (
				<ArticleEntry key={article.id} article={article} deleteIt={props.deleteIt}/>
			))}
		</div>
	);
}

export default ArticleList;