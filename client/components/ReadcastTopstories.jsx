// Readcast vs Top stories selector component

import React from 'react';
import { Button, Col } from 'react-bootstrap';

class WhichView extends React.Component {
  constructor() {
		super();
	}

  // const ShowReadcasts = function() {
  //   console.log('firing ShowReadcasts...')
  // }

  // function ShowLibrary () {
  //   console.log('firing ShowLibrary...')
  // }


  render() {
    return (
      <Col md={8} mdOffset={2} className="readcasts-topstories">
        <Button bsStyle="info">Your Readcasts</Button>
        <Button bsStyle="default">Top stories</Button>
        <div><br></br></div>
      </Col>
    );
  }
}

export default WhichView;



// function ShowLibrary () {
//   console.log('firing ShowLibrary...')
// }
// <Button bsStyle="primary" onClick={ShowReadcasts}>Your Readcasts</Button>
// <Button bsStyle="danger" onClick={ShowLibrary}>Top stories</Button>
