import React from 'react';
import Modal from 'react-bootstrap';

class SignupButton extends React.Component {
  constructor() {
		super();
		this.state = {
      showModal : false
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
	}

  handleOpenModal() {
    this.setState({showModal: true});
  }

  handleCloseModal() {
    this.setState({showModal: false});
  }

  render(){
    return (
      <div>
        <button type='button' onClick={this.handleOpenModal}>Modal</button>

        <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title id='ModalHeader'>A Title Goes here</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Some Content here</p>
          </Modal.Body>
          <Modal.Footer>
            // If you don't have anything fancy to do you can use
            // the convenient `Dismiss` component, it will
            // trigger `onHide` when clicked
            <Modal.Dismiss className='btn btn-default'>Cancel</Modal.Dismiss>

            // Or you can create your own dismiss buttons
            <button className='btn btn-primary'>
              Save
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default SignupButton;
