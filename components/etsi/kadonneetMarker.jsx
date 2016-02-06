import React from 'react';
import {Modal, FormControls, Input} from 'react-bootstrap';
import ConfirmDialog from './../modals/confirmDialog.jsx';
import DateTimePicker from 'react-bootstrap-datetimepicker';
import $ from 'jquery';
import Spinner from './../spinner.jsx';
import KadonneetConfirmDialog from './kadonneetConfirmDialog.jsx';

class KadonneetMarker extends React.Component{
  
  constructor(){
    super();
    this.state = {saveMarking: false};
  }

  renderConfirm(){

    console.log('rendering confirmmm');

    let saveMarking = _ => {
      this.setState({saving: true});
      var saveobj = {
        _id: this.props.item._id,
        radius: this.props.radius,
        location: this.props.location,
        searchResult: this.state.searchResult,
        latLng: {
          lat: this.props.position.lat(),
          lng: this.props.position.lng()
        },
        ajankohtaTimestamp: this.state.ajankohtaTimestamp
      };
      $.ajax({
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        url: '/savemarking',
        data: JSON.stringify(saveobj),
        success: _ => {
          this.setState({saving: false, saveMarking: false});
          this.props.onclose();
        }
      });
    };
  }

  render(){
    const confirmSaveMarking = _ => {
      console.log('got', this.props);     
      this.props.confirmdialogactions.saveMarking();
   //   this.setState({saveMarking: true, ajankohtaTimestamp: n});
    };

    return (<Modal.Header>
      <div className="row">
        <div className="col-md-8 col-xs-6 small">
          <div>Etsitty kohteesta <strong>{this.props.location}</strong> säteellä {this.props.radius} m.</div>
          <div>Etäisyys katoamiskohteesta <strong>{this.props.katoamisdistance} m</strong></div>
        </div>
        <div className="col-md-4 col-xs-6">
          <div className="btn-toolbar pull-right">
            <button onClick={this.props.onclose} className="btn btn-default">Sulje</button>
            <button onClick={confirmSaveMarking} className="btn btn-primary">Tallenna</button>
          </div>
        </div>
      </div>
      {
          this.props.confirmdialog ? <KadonneetConfirmDialog {...this.props.confirmdialogactions} {...this.props.confirmdialog} />
 : ''
        }
    </Modal.Header>)
  }
}
KadonneetMarker.defaultProps = {searchResults: [{value: 1, label: 'Ei havaintoa'}, {value: 2, label: 'Löydetty elävänä'}, {
  value: 3,
  label: 'Löydetty kuolleena'
}]};
export default KadonneetMarker;