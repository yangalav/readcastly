import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class Confirm extends React.Component {
  constructor(props) {
    super(props);
  };

  render () {
    let close = () => this.props.toggleConfirm();
    let deleteClose = () => {
      this.props.deleteArticle(this.props.url)
        .then( () => close() )
        .catch( (err) => console.log('ERROR DELETE-CLOSE', err))
    }

    let destination = this.props.user[this.props.method];

    return (
      <div style={{height: 200}}>
        <Modal
          show={this.props.showConfirm}
          onHide={close}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Success!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Congratulations!  Your Readcast has been delivered to {destination}.
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="danger" onClick={deleteClose}>Remove article from library</Button>
            <Button bsStyle="success" onClick={close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

};

export default Confirm;
