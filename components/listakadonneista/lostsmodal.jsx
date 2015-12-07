import MapModal from './../modals/mapmodal.jsx';
import React from 'react';
import Map from './../map.jsx';
import {Modal, Image} from 'react-bootstrap';


export default class LostsModal extends React.Component {

  constructor() {
    super();
    this.close = this.close.bind(this);
  }

  componentWillReceiveProps(nextProps) {
  }

  close() {
  }

  render() {
    return (
      <MapModal onHide={this.props.onclosemodal}  size="large" title={this.props.item.name}>
        <Modal.Body>
          <Map findings={this.props.item.findings}/>
        </Modal.Body>
      </MapModal>

    )
  }
}
