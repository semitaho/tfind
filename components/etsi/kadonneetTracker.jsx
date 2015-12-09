import React from 'react';
import {Modal} from 'react-bootstrap';

class KadonneetTracker extends React.Component {
  render(){
    return (<Modal.Header>
      <div className="row">
        <div className="col-md-8 col-xs-6 small">
          Kuljettu matka {this.props.length} m.
        </div>
        <div className="col-md-4 col-xs-6">
          <div className="btn-group pull-right">
            <button type="button" className="btn btn-default btn-sm" onClick={this.props.onclose}>Peruuta etsintä
            </button>
            <button type="button" className="btn btn-primary btn-sm">Tallenna</button>
          </div>
        </div>
      </div>
    </Modal.Header>);
  }

}


export default KadonneetTracker;