import React from 'react';
import { hashHistory } from 'react-router';
import { Modal, Button } from 'react-bootstrap';

class MembersOnly extends React.Component {
  constructor(props) {
    super(props);
  };

  close() {
    this.props.toggleMembersOnly();
  }

  signUp() {
    this.close();
    hashHistory.push('/signup');
  }

  signIn() {
    this.close();
    hashHistory.push('/');
  }

  render () {
    return (
      <div style={{height: 200}}>
        <Modal
          show={this.props.showMembersOnly}
          onHide={close}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title">Intrigued?</Modal.Title>
          </Modal.Header>
          <Modal.Body>That feature is only available to registered users.  Sign in or join our ranks by clicking the buttons below!</Modal.Body>
          <Modal.Footer>
            <Button bsStyle="danger" onClick={this.signUp.bind(this)}>Sign Up</Button>
            <Button bsStyle="warning" onClick={this.signIn.bind(this)}>Sign In</Button>
            <Button className="modal-close" bsStyle="success" onClick={this.close.bind(this)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

};

export default MembersOnly;

// {this.props.method === 'link' ?
//             (<Modal.Body>Thank you for using Readcast.ly!  Right-click <a href={this.props.link}>here</a> to download your Readcast!</Modal.Body>) :
//             (<Modal.Body>Congratulations!  Your Readcast has been delivered to {destination}.</Modal.Body>)
//           }