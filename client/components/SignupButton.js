import React from 'react';
import Modal from 'react-bootstrap-modal';

class SignupButton extends React.Component {
  constructor() {
		super();
		this.state = {
      open : false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
	}

  openModal() {
    this.setState({open: true});
  }

  afterOpenModal() {
    this.refs.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({open: false});
  }

  render(){
    // let closeModal = () => this.setState({ open: false })

    // let saveAndClose = () => {
    //   api.saveData()
    //     .then(() => this.setState({ open: false }))
    // }

    return (
      <div>
        <button type='button' onClick={this.openModal}>Launch modal</button>

        <Modal
          isOpen={this.state.open}
          onHide={closeModal}
          aria-labelledby="ModalHeader"
        >
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
