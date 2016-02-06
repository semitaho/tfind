import React from 'react';
import ConfirmDialog from './../modals/confirmDialog.jsx';
import {Modal, FormControls, Input} from 'react-bootstrap';
import DateTimePicker from 'react-bootstrap-datetimepicker';
import Spinner from './../spinner.jsx';

class KadonneetConfirmDialog extends React.Component{


  render(){
 
    const ajankohtaChange = (e) => {
      console.log('this.props', this.props);
      this.props.changeAjankohta(e);
    };

    const searchResultChange = () => {

    };


    return (<ConfirmDialog onHide={this.props.cancelConfirmMarking} onSave={this.props.doSaveMarking}>
        {this.props.saving ? <Spinner dimm='confirm-form' /> : '' }
        <form className="form-horizontal" id="confirm-form">
          <FormControls.Static label="Nimi" value={this.props.name} labelClassName="col-md-4"
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
      </ConfirmDialog>)
  }

}

KadonneetConfirmDialog.defaultProps = {searchResults: [{value: 1, label: 'Ei havaintoa'}, {value: 2, label: 'Löydetty elävänä'}, {
  value: 3,
  label: 'Löydetty kuolleena'
}]};

export default KadonneetConfirmDialog;

