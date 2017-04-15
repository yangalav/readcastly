// ArticleList component (i.e., the container for Articles)
  // - a stateless component [that became stateful with addition of react-sortable-hoc]

import React from 'react';
// import {Grid} from 'react-bootstrap';
import ArticleEntry from './ArticleEntry.jsx';

import {Component} from 'react';
import {render} from 'react-dom';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

const SortableItem = SortableElement(({ index, user, value, exportOptions }) =>
  <ArticleEntry key={index} user={user} article={value} exportOptions={exportOptions} />
);

const SortableList = SortableContainer(({ articles, user, exportOptions }) => (
    <ul>
      {articles.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} user={user} exportOptions={exportOptions} />
      ))}
    </ul>
  ));

// class SortableComponent extends Component {
// 	constructor(props) {
// 		console.log('props', props);
// 		super(props);
//   	this.state = { // documentation doesn't use constructor or super; starts @ state = {} (no this)
//     	items: this.props.articles
//   	};
// 	}
//   onSortEnd ({oldIndex, newIndex}) {
//     this.setState({
//       items: arrayMove(this.state.items, oldIndex, newIndex),
//     });
//   };
//   render() {
// 		console.log('this.state.items =', this.state.items)
//     return <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />; //props.user
//   }
// }

export default SortableList;

// function ArticleList(props) {
//
// 	return (
// 		<Grid className='article-list'>
// 			{props.articles.map((article) => (
// 				<ArticleEntry key={article.id} article={article} user={props.user} exportOptions={props.exportOptions} deleteIt={props.deleteIt} convertIt={props.convertIt} topStoryMode={props.topStoryMode} toggleConvert={props.toggleConvert} isConverting={props.isConverting}/>
// 			))}
// 		</Grid>
// 	);
// }
