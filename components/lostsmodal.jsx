import Modal from 'react-bootstrap/lib/Modal';
import React from 'react';
import Image from 'react-bootstrap/lib/Image';


export default class LostsModal extends React.Component {

  constructor() {
    super();
    this.close = this.close.bind(this);
    this.state = {showmodal: false};
  }

  componentWillReceiveProps(nextProps) {
    console.log('hah');
    this.setState({showmodal: nextProps.showmodal});
  }

  close() {
    this.setState({showmodal: false});
    console.log('joojoo');
  }

  render() {
    return (
      <Modal show={this.state.showmodal} onHide={this.props.onclosemodal}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.item.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image src={this.props.item.imgsrc} responsive circle />
        </Modal.Body>
      </Modal>

    )
  }
}