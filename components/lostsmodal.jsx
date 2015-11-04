import Modal from 'react-bootstrap/lib/Modal';
import React from 'react';
import Image from 'react-bootstrap/lib/Image';
import Map from './map.jsx';


export default class LostsModal extends React.Component {

  constructor() {
    super();
    this.close = this.close.bind(this);
    this.state = {showmodal: false};
  }

  componentWillReceiveProps(nextProps) {
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
          <Map findings={this.props.item.findings} />
        </Modal.Body>
      </Modal>

    )
  }
}
