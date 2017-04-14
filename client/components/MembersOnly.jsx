import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class MembersOnly extends React.Component {
  constructor(props) {
    super(props);
  };

  render () {
    let close = () => this.props.toggleMembersOnly();
    let signUp = () => {
      // console.log('URL FOR MODAL === ', this.props.url);
      // this.props.deleteArticle(this.props.url);
      // this.props.toggleConfirm();
    }


    return (
      <div style={{height: 200}}>
        <Modal
          show={this.props.showMembersOnly}
          onHide={close}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Intrigued?</Modal.Title>
          </Modal.Header>
          <Modal.Body>That feature is only available to registered users.  Sign in or join our ranks by clicking the buttons below!</Modal.Body>
          <Modal.Footer>
            <Button bsStyle="danger" onClick={close}>Sign Up</Button>
            <Button bsStyle="warning" onClick={close}>Sign In</Button>
            <Button bsStyle="success" onClick={close}>Close</Button>
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