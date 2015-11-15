import React from 'react';
import {Modal} from 'react-bootstrap';
let MapModal = (props) => {

  return (<Modal onHide={props.onHide} id="modal" bsSize={props.size ? props.size : 'medium'} show={true}>
    <Modal.Header closeButton>{props.title}</Modal.Header>
    {props.children}
  </Modal>  )
};

export default MapModal;