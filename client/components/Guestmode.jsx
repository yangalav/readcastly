import React from 'react';

import axios from 'axios';
import Checkboxes from './Checkboxes.jsx'
import ArticleList from './ArticleList.jsx'
import {Grid, Button, Col, Row, FormGroup, FormControl } from 'react-bootstrap';
import Loading from 'react-loading';

// const sources = [
//   {id: "associated-press", name: 'Associated Press'},
//   {id: 'bbc-news', name: 'BBC News'},
//   {id: 'business-insider', name: 'Business Insider'},
//   {id: 'cnn', name: 'CNN'},
//   {id: 'daily-mail', name: 'Daily Mail'},
//   {id: 'the-economist', name: 'The Economist'},
//   {id: 'entertainment-weekly', name: 'Entertainment Weekly'},
//   {id: 'espn', name: 'ESPN'},
//   {id: 'hacker-news', name: 'Hacker News'},
//   {id: 'new-scientist', name: "New Scientist"},
//   {id: 'new-york-magazine', name: 'New York Magazine'},
//   {id: 'the-new-york-times', name: 'The New York Times'},
//   {id: 'recode', name: 'Recode'},
//   {id: 'techcrunch', name: 'TechCrunch'},
//   {id: 'time', name: 'Time'},
//   {id: 'the-washington-post', name: 'The Washington Post'},
//   {id: 'usa-today', name: 'USA Today'}
// ];

let user = {
        id: 99,
        stream: 'stream',
        link: 'link'
      };

let randomId = 10**9;

class GuestMode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
                    source: '',
                    headlines : [],
                    gettingHeadlines: true
                     };
  }

  // randomizer(){
  //   let randomSource = sources[Math.floor(Math.random()*sources.length)];
  //   this.props.getTopStories([randomSource.id]);
  //   console.log('YOUR RANDOM SOURCE WOULD HAVE BEEN: ', randomSource.name);
  // }

  handleSourceChange(source) {
    if(source.target.value !== 'banana') {
      this.setState({gettingHeadlines: true})
      this.getHeadlines(source.target.value,source.target.data);
    }
  }

  getHeadlines(source,banner) {
    axios.post('/guestStories', {source: source})
      .then((res) => {
        // console.log(res.data);
        res.data.forEach((article) => {
          if (article.publication_date) {
            article.publication_date = this.props.cleanDate(article.publication_date);
          }
          article.est_time = this.props.cleanTime(article.est_time);
           randomId++
           article.id = randomId;
         });
        this.setState({ headlines: res.data}, function() {
          this.setState({source: banner, gettingHeadlines: false});
        });
        // console.log(this.state.headlines);
      })
      .catch((err) => console.log('Unable to retrieve headlines', err));
  }

  makeSourcesMenu(sources) {
    return(
      <Grid>
        <Row>
          <Col md={12} >
            <div className="source-chooser">
              <FormGroup controlId="sourceSelect">
                <FormControl componentClass="select" value={this.state.source} onChange={this.handleSourceChange.bind(this)} placeholder="banana">
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

  componentWillMount() {
    // this.randomizer();
    this.getHeadlines('google-news',null);
  }

  render() {
    return (
      <div className="guestMode">
        <h1 style={{textAlign:'center',color:'red'}}>welcome to GUEST MODE</h1>
        {this.makeSourcesMenu(this.props.topStoriesSources)}
        <div id="guestStories">
        {this.state.headlines && <ArticleList articles={this.state.headlines} user={user} deleteIt={this.props.deleteIt.bind(this)} convertIt={this.props.convertIt.bind(this)} exportOptions={this.props.exportOptions} isGuest={this.props.isGuest} topStoryMode={this.props.topStoryMode} toggleConvert={this.props.toggleConvert.bind(this)} isConverting={this.props.isConverting} toggleMembersOnly={this.props.toggleMembersOnly.bind(this)} />}
        {this.state.gettingHeadlines &&
          <div id="loadingOverlay">
            <Loading type="spin" color="red" />
          </div>}
        </div>
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
