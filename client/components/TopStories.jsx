import React from 'react';

import axios from 'axios';
import Checkboxes from './Checkboxes.jsx'
import ArticleList from './ArticleList.jsx'
import {Grid, Button, Col, Row, FormGroup, FormControl } from 'react-bootstrap';
import Loading from 'react-loading';


// let randomId = 10**9;

class TopStories extends React.Component {
  constructor(props) {
    super(props);
    this.state = { source: '' };
  }

  handleSourceChange(source) {
    if(source.target.value !== 'banana') {
      this.props.toggleHeadlines()
      this.props.getHeadlines(source.target.value);
      this.setState({source: source.target.data});
    }
  }

  makeSourcesMenu(sources) {
    return(
      <Grid>
        <Row>
          <Col md={12} >
            <div className="source-chooser">
              <FormGroup id="sourceSelect" >
                <FormControl id="sourceSelect" componentClass="select" value={this.state.source} onChange={this.handleSourceChange.bind(this)} placeholder="banana">
                <option value="banana">Choose a News Source</option>
                {sources.map((source,i) => (<option key={i} value={source.id} data={source.name}>{source.name}</option>))}
                </FormControl>
              </FormGroup>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }

  render() {
    return (
      <div className="topStoriesMode">
        {this.makeSourcesMenu(this.props.topStoriesSources)}
        <div id="topStories">
        {this.props.headlines && <ArticleList articles={this.props.headlines} user={this.props.user} deleteIt={this.props.deleteIt.bind(this)} convertIt={this.props.convertIt.bind(this)} exportOptions={this.props.exportOptions} isGuest={this.props.isGuest} topStoryMode={this.props.topStoryMode} toggleConvert={this.props.toggleConvert.bind(this)} isConverting={this.props.isConverting} toggleMembersOnly={this.props.toggleMembersOnly.bind(this)} addIt={this.props.addIt.bind(this)} />}
        </div>
      </div>
    );
  }

}

export default TopStories;

// {/*<Checkboxes sources={sources} getTopStories={this.props.getTopStories.bind(this)} />*/}
// <Grid>
//   <Row>
//     <Col md={4} mdOffset={4}>
//       <Button bsStyle="success" bsSize="large" onClick={this.randomizer} block>Get headlines</Button>
//     </Col>
//   </Row>
// </Grid>
