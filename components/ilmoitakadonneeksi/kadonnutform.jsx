import React from 'react';
import ReactDOM from 'react-dom';
import {Panel, Input, ProgressBar, Button, ButtonGroup,FormControls, Tabs, Tab} from 'react-bootstrap';

import $ from 'jquery';
import DateTimePicker from 'react-bootstrap-datetimepicker';
import Map from './../map.jsx';
import Spinner from './../spinner.jsx';
import Next from './../forms/next.jsx';
import ConfirmDialog from './../modals/confirmDialog.jsx';
import Page from './../page.jsx';

class KadonnutForm extends React.Component {
  constructor() {
    super();
    this.onPasteImage = this.onPasteImage.bind(this);
    this.timeChange = this.timeChange.bind(this);
  }

  isValid(params) {
    var isValid = true;
    params.forEach(param => {
      var name = this.props.formstate[param];
      if (name === null || name === undefined || name.length === 0) {
        isValid = false;
      }
    });
    return isValid;

  }

  isMapValid() {
    let location = this.props.formstate['location'];
    if (location && location.lat && location.lng) {
      return true;
    }
    return false;
  }

  onPasteImage(e) {
    var content = e.target.value;
    var img = new Image();
    img.onload = () => {
      this.props.changeField('imgsrc', content);
    };

    img.onerror = () => {
      this.props.changeField('imgsrc', null);
      console.log('cannot paste image....')
    }
    img.src = content;
  }

  timeChange(e) {
    if (!isNaN(e)) {      
      this.props.changeField('timestamp', e);
    } else {
      this.props.changeField('timestamp', null);
    }
  }

  isTimeValid() {
    var time = this.props.formstate.timestamp;
    if (time && !isNaN(time)) {
      return true;
    }
    return false;

  }

  render() {
    let isNameValid = this.isValid(["name"]);
    let isDescriptionValid = this.isValid(['name', 'description']);
    let isImageValid = this.isValid(['name', 'description', 'imgsrc']);

    let isTimeValid = this.isValid(['name', 'description', 'imgsrc']) && this.isTimeValid();
    let isMapValid = this.isValid(['name', 'description', 'imgsrc']) && this.isTimeValid() && this.isMapValid();

    let fields = [isNameValid, isDescriptionValid, isImageValid, isTimeValid, isMapValid];

    var correctCount = 0;
    for (let field of fields) {
      if (field) {
        correctCount++;
      }

    }
    let isFormValid = isMapValid;
    const radiusChanged = (radius) => this.props.changeRadius(Math.round(radius));
    const areaSelected = (event) =>  this.props.selectArea(event);
    const onSave = () => this.props.onSave(this.props.formstate);      
    return (
      <Page title="Ilmoita kadonneeksi">
        <p className="lead">Onko joku sukulainen tai tuttusi kadonnut? Tällä sivulla voit ilmoittaa henkilön kadonneeksi ja tarvittaessa julkaista tapaus Sosiaalisessa mediassa.</p>
        <p className="lead">Täytä allaoleva lomake huolellisesti.</p>  
      <div className="row">
        <div className="col-md-12">
          <label className="control-label">Edistys</label>
          <ProgressBar now={ Math.round((correctCount / fields.length ) * 100)} label="%(percent)s%" bsStyle="success"/>
        </div>
        <div className="col-md-12">
          <Tabs activeKey={this.props.active} onSelect={key => this.props.togglePage(key)}>

            <Tab eventKey={1} title="1. Nimi" tabIndex="-1">
              <div className="wizard-content">
                <Input bsSize="large" tabIndex="1" type="text" name="name" onChange={ e =>  this.props.changeField('name', e.target.value)}
                       placeholder="Syötä muodossa etunimi sukunimi"
                       value={this.props.formstate.name}
                       label="Henkilön nimi"/>
                <Next disabled={!isNameValid} onClick={() => this.props.togglePage(2)}/>
              </div>
            </Tab>
            {isNameValid ?
              <Tab title="2. Tiedot" tabIndex="-1" eventKey={2}>
                <div className="wizard-content">
                  <Input bsSize="large" type="textarea" autoFocus="true" tabIndex="2"
                         placeholder="Kuvaile kadonnutta mahdollisimman tarkasti" name="description"
                         label="Henkilön kuvaus" value={this.props.description} onChange={ e =>  this.props.changeField('description', e.target.value)}
                    />
                </div>
                <Next disabled={!isDescriptionValid} onClick={() => this.props.togglePage(3)}/>

              </Tab> : ''}

            {isDescriptionValid ?
              <Tab title="3. Kuva" eventKey={3} tabIndex="-1">
                <div className="wizard-content">
                  <Input
                    type="text" bsSize="large"
                    onBlur={this.onPasteImage} label="Kuva henkilöstä" className="form-control"
                    placeholder="Liitä kuva kadonneesta henkilöstä" hasFeedback/>
                  {this.props.formstate.imgsrc ?
                    <img src={this.props.formstate.imgsrc} className="thumbnail img-responsive"/>
                    : ''}
                </div>
                <Next disabled={!isImageValid} onClick={() => this.props.togglePage(4)}/>

              </Tab>
              : '' }
            {isImageValid ?
              <Tab title="4. Katoamishetki" eventKey={4} tabIndex="-1">
                <div className="wizard-content">
                  <div className='form-group'>
                    <label className="control-label">Katoamisajankohta</label>
                    <DateTimePicker defaultText="" format="x" size="sm"
                                    inputFormat="D.M.YYYY H:mm"
                                    onChange={this.timeChange}/>
                  </div>


                  {isTimeValid ?
                    <div className="form-group">
                      <label className="control-label">Viimeisin havainto kartalla</label>
                      <Map id="kadonneet-form-map" initialZoom={this.props.initialZoom}
                           radius={this.props.radius}
                           radiuschanged={radiusChanged}
                           circle={this.props.circle}
                           center={this.props.center}
                           onmapclick={areaSelected}/>
                      <label><strong>{this.props.formstate.address}</strong> säteellä <strong>{this.props.radius} m</strong>.</label>
                    </div>
                    : ''}
                </div>
                <Next disabled={!isMapValid} onClick={() => this.props.togglePage(5)}/>

              </Tab>
              : ''}

            {isFormValid ?
              <Tab title="5. Esikatselu" eventKey={5} tabIndex="-1">
                <div className="wizard-content">
                  <fieldset>
                    <legend>Tarkista lomakkeen tiedot</legend>
                    <form className="form-horizontal" id="confirm-form">
                      <FormControls.Static label="Henkilön nimi" value={this.props.formstate.name}
                                           labelClassName="col-md-3"
                                           wrapperClassName="col-md-9"/>
                      <FormControls.Static label="Henkilön kuvaus" value={this.props.formstate.description}
                                           labelClassName="col-md-3"
                                           wrapperClassName="col-md-9"/>

                      <div className="form-group">
                        <label className="control-label col-md-3">
                          <span>Kuva henkilöstä</span>
                        </label>

                        <div className="col-md-9">
                          <img className="thumbnail img-responsive" src={this.props.formstate.imgsrc}/>
                        </div>

                      </div>
                      <FormControls.Static label="Katoamisajankohta"
                                           value={this.formatTime(this.props.formstate.timestamp)}
                                           labelClassName="col-md-3"
                                           wrapperClassName="col-md-9"/>
                      <FormControls.Static label="Katoamispaikka" value={this.props.formstate.address}
                                           labelClassName="col-md-3"
                                           wrapperClassName="col-md-9"/>

                      <div className="btn-group pull-right">
                        <Button onClick={onSave} bsStyle="primary" bsSize="large">Ilmoita</Button>
                      </div>

                    </form>
                  </fieldset>
                  {this.props.loading ?
                    <Spinner dimm="confirm-form"/> : ''
                  }
                </div>

              </Tab> : ''}

          </Tabs>

        </div>
      </div></Page>)
  }

  formatTime(timestamp) {
    let dt = new Date(timestamp * 1);
    let time = dt.getDate() + '.' + (dt.getMonth() + 1) + '.' + dt.getFullYear() + ' ' + dt.getHours() + ':' + dt.getMinutes();
    return time;
  }

}
KadonnutForm.defaultProps = {tilanteet: [{value: 1, label: 'Kadonnut'}]};

export default KadonnutForm;