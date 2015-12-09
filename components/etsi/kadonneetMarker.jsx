import React from 'react';
import {Modal, FormControls, Input} from 'react-bootstrap';
import ConfirmDialog from './../modals/confirmDialog.jsx';
import DateTimePicker from 'react-bootstrap-datetimepicker';
import $ from 'jquery';
import Spinner from './../spinner.jsx';


class KadonneetMarker extends React.Component{
  
  constructor(){
    super();
    this.state = {saveMarking: false};
    this.cancelConfirmMarking = this.cancelConfirmMarking.bind(this);

  }


  cancelConfirmMarking() {
    this.setState({saveMarking: false});
  }

  renderConfirm(){
      let ajankohtaChange = (val) => {
      this.setState({ajankohtaTimestamp: val});
    };

    let searchResultChange = (event) => {
      this.setState({searchResult: event.target.value});
    };

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

    return (
      <ConfirmDialog onHide={this.cancelConfirmMarking} onSave={saveMarking}>
        {this.state.saving ? <Spinner dimm='confirm-form' /> : '' }
        <form className="form-horizontal" id="confirm-form">
          <FormControls.Static label="Nimi" value={this.props.item.name} labelClassName="col-md-4"
                               wrapperClassName="col-md-8"/>
          <FormControls.Static label="Etsitty kohteesta" value={this.props.location} labelClassName="col-md-4"
                               wrapperClassName="col-md-8"/>
          <FormControls.Static label="Etsintäsäde" value={this.props.radius+' m'} labelClassName="col-md-4"
                               wrapperClassName="col-md-8"/>

          <div className="form-group">
            <label className="control-label col-md-4">
              Etsintäajankohta
            </label>

            <div className="col-md-8">
              <DateTimePicker format="x" ref="time"
                              inputFormat="D.M.YYYY H:mm"
                              onChange={ajankohtaChange}/>
            </div>
          </div>
          <Input type="select" labelClassName="col-md-4" wrapperClassName="col-md-8" label="Etsinnän tulos"
                 onChange={searchResultChange}
                 placeholder="1">
            {this.props.searchResults.map(item => {
              return (<option value={item.value}>{item.label}</option>)
            }) }
          </Input>

        </form>
      </ConfirmDialog>
    )
  }



  render(){
    let confirmSaveMarking = _ => {
      var d = new Date();
      var n = d.getTime();
      this.setState({saveMarking: true, ajankohtaTimestamp: n});
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
          this.state.saveMarking ? this.renderConfirm() : ''
        }
    </Modal.Header>)
  }
}
KadonneetMarker.defaultProps = {searchResults: [{value: 1, label: 'Ei havaintoa'}, {value: 2, label: 'Löydetty elävänä'}, {
  value: 3,
  label: 'Löydetty kuolleena'
}]};
export default KadonneetMarker;