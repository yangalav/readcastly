// Readcast vs Top stories selector component

import React from 'react';
import Switch from 'react-bootstrap-switch';
import { Button, Col } from 'react-bootstrap';

class WhichView extends React.Component {
  constructor(props) {
		super(props);
	}


  render() {
    return (
      <Col md={8} mdOffset={2} className="readcasts-topstories">
         {this.props.topStoryMode ?
          (<div className="switcher">
             <Button bsStyle="default" onClick={this.props.toggleView.bind(this)}>Your readcasts</Button>
             <Button bsStyle="primary" onClick={this.props.toggleView.bind(this)}>Top stories</Button>
            </div>) :
          (<div className="switcher">
             <Button bsStyle="primary" onClick={this.props.toggleView.bind(this)}>Your readcasts</Button>
             <Button bsStyle="default" onClick={this.props.toggleView.bind(this)}>Top stories</Button>
           </div>)
          }
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
//   render() {
//     return (
//       <Col md={8} mdOffset={2} className="readcasts-topstories">
//         <Button bsStyle="primary">Your readcasts</Button>
//         <Button bsStyle="default">Top stories</Button>
//         <div><br></br></div>
//       </Col>
//     );
//   }
// }
// <Switch bsSize="large" onColor="warning" offColor="warning" onChange={this.props.toggleView.bind(this)} />
