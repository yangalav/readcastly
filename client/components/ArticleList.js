// ArticleList component (i.e., the container for Articles)

import React from 'react';
import ArticleEntry from './ArticleEntry';

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

export default ArticleList;