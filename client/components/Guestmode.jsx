import React from 'react';
import Checkboxes from './Checkboxes.jsx'
import ArticleList from './ArticleList.jsx'
import {Grid, Button, Col, Row} from 'react-bootstrap';

const sources = [
  {id: "associated-press", name: 'Associated Press'},
  {id: 'bbc-news', name: 'BBC News'},
  {id: 'business-insider', name: 'Business Insider'},
  {id: 'cnn', name: 'CNN'},
  {id: 'daily-mail', name: 'Daily Mail'},
  {id: 'the-economist', name: 'The Economist'},
  {id: 'entertainment-weekly', name: 'Entertainment Weekly'},
  {id: 'espn', name: 'ESPN'},
  {id: 'hacker-news', name: 'Hacker News'},
  {id: 'new-scientist', name: "New Scientist"},
  {id: 'new-york-magazine', name: 'New York Magazine'},
  {id: 'the-new-york-times', name: 'The New York Times'},
  {id: 'recode', name: 'Recode'},
  {id: 'techcrunch', name: 'TechCrunch'},
  {id: 'time', name: 'Time'},
  {id: 'the-washington-post', name: 'The Washington Post'},
  {id: 'usa-today', name: 'USA Today'}
];

class GuestMode extends React.Component {
  constructor(props) {
    super(props);
    this.state = { randomMode : true };
  }

  randomizer(){
    let randomSource = sources[Math.floor(Math.random()*sources.length)];
    this.props.getTopStories([randomSource.id]);
    console.log('YOUR RANDOM SOURCE WOULD HAVE BEEN: ', randomSource.name);
  }

  makeSourcesMenu(sources) {
    return(
      <div className="source-chooser">
        <FormGroup controlId="sourceSelect">
          <FormControl componentClass="select" value={this.state.voice} onChange={this.handleVoiceChange.bind(this)} placeholder="banana">
          <option value="banana">Choose a News Source</option>
          {sources.map((source,i) => (<option key={i} value={source.id} >{source.name}</option>))}
          </FormControl>
        </FormGroup>
      </div>
    );
  }

  sourceMenu() {return (this.makeSourceMenu(this.props.topStoriesSources));}

  // componentDidMount() {
  //   // this.randomizer();
  //   this.getTopStories();
  // }

  render() {
    return (
      <div className="topStories">
        {this.props.headlines && <ArticleList articles={this.props.headlines} user={this.props.user} deleteIt={this.props.deleteIt.bind(this)} convertIt={this.props.convertIt.bind(this)} exportOptions={this.props.exportOptions} topStoryMode={this.props.topStoryMode}/>}
      </div>
    );
  }

}

export default GuestMode;

// {/*<Checkboxes sources={sources} getTopStories={this.props.getTopStories.bind(this)} />*/}
// <Grid>
//   <Row>
//     <Col md={4} mdOffset={4}>
//       <Button bsStyle="success" bsSize="large" onClick={this.randomizer} block>Get headlines</Button>
//     </Col>
//   </Row>
// </Grid>