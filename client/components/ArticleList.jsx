// ArticleList component (i.e., the container for Articles)
  // - a stateless component

import React from 'react';
// import {Grid} from 'react-bootstrap';
import ArticleEntry from './ArticleEntry.jsx';

import {Component} from 'react';
import {render} from 'react-dom';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

const SortableItem = SortableElement(({value}) =>
  <li>{value}</li>
);

const SortableList = SortableContainer(({items}) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </ul>
  );
});

class SortableComponent extends Component {
	constructor(props) {
		super(props);
  	this.state = { // documentation doesn't use constructor or super; starts @ state = {} (no this)
    	items: this.props.articles
  	};
	}
  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    });
  };
  render() {
    return <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />;
  }
}

export default ArticleList;

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
