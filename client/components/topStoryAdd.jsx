import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class TopStoryAdd extends React.Component {
  constructor(props) {
    super(props);
  };

  render () {
    let close = () => this.props.toggleTopStoryAdd();
    let redirect = () => {
      this.props.toggleView();
      this.props.toggleTopStoryAdd();
    }

    return (
      <div style={{height: 200}}>
        <Modal
          show={this.props.showModal}
          onHide={close}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title">{this.props.topStoryAddMsg.result}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.props.topStoryAddMsg.message}</Modal.Body>
          <Modal.Footer>
            <Button bsStyle="warning" onClick={redirect}>Go to your library</Button>
            <Button className= "modal-close" bsStyle="success" onClick={close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

};

export default TopStoryAdd;
