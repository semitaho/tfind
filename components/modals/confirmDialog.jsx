import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';

export default class ConfirmDialog extends React.Component {

  render(){
    return (
      <Modal id="confirm-modal" show={true} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Tarkista seuraavat tiedot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {this.props.children}
        </Modal.Body>
        <Modal.Footer>
          <div className="btn-group pull-right">
            <button className="btn btn-primary" onClick={this.props.onSave}>Tallenna</button>
          </div>
         </Modal.Footer>
      </Modal>

    )
  }

};