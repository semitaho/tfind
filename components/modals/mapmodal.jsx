import React from 'react';
import {Modal} from 'react-bootstrap';
class MapModal extends React.Component {
  render() {
    let props = this.props;
    return (<Modal onHide={props.onHide} id="modal" bsSize={props.size ? props.size : 'medium'} show={true}>
      <Modal.Header closeButton>{props.title}</Modal.Header>
      {props.children}
    </Modal>  )
  }

  componentDidMount(){
    console.log('map modal did mount');
    let h = $(window).height();
    let id = '#modal';
    let modalElement = $(id);
    let mapY = modalElement.offset().top;
    let footerHeight = $('#footer').height();
    $(id).height(h-mapY-30);
  }

}
export default MapModal;