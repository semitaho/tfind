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

  calculateCenter() {
    let findings = this.props.item.findings;
    if (findings.length === 0) {
      return {
        lat: 63.612101,
        lng: 26.175575
      };
    }
    if (findings.length == 1) {
      return {
        lat: findings[0].lat,
        lng: findings[0].lng
      };
    }

    var latSum = findings.reduce((prev, current, index, array) => {
      return current.lat + prev;
    }, 0);
    var lngSum = findings.reduce((prev, current, index, array) => {
      return current.lng + prev;
    }, 0);
    var finding = findings[findings.length - 1];
    return {lat: latSum / findings.length, lng: lngSum / findings.length};
  }

  calculateRoutePoints() {
    let points = this.props.item.findings.map(finding => {
      return {lat: finding.lat, lng: finding.lng};
    });

    return points;
  }

  render() {
    return (
      <MapModal onHide={this.props.onCloseModal} size="large" title={this.props.item.name}>
        <Modal.Body>
          <Map findings={this.props.item.findings} center={this.calculateCenter()} route={this.calculateRoutePoints()}/>
        </Modal.Body>
      </MapModal>

    )
  }
}
