import React from 'react';
import ReactDOM from 'react-dom';
import {Panel, Input, ProgressBar, Button, ButtonGroup,FormControls, Tabs, Tab} from 'react-bootstrap';
import $ from 'jquery';
import DateTimePicker from 'react-bootstrap-datetimepicker';
import Map from './map.jsx';
import Spinner from './spinner.jsx';
import Next from './forms/next.jsx';
import ConfirmDialog from './modals/confirmDialog.jsx';
class KadonnutForm extends React.Component {
  constructor() {
    super();
    this.state = {formstate: {}, activeKey: 1};
    this.handleTextChange = this.handleTextChange.bind(this);
    this.onPasteImage = this.onPasteImage.bind(this);
    this.timeChange = this.timeChange.bind(this);
  }

  componentDidMount() {
    console.log('on mount');
  }

  isValid(params) {
    var isValid = true;
    params.forEach(param => {
      var name = this.state.formstate[param];
      if (name === null || name === undefined || name.length === 0) {
        isValid = false;
      }
    });
    return isValid;

  }

  isMapValid() {
    let location = this.state.formstate['location'];
    if (location && location.lat && location.lng) {
      return true;
    }
    return false;
  }

  handleTextChange(event) {
    this.setFormstate(event.target.name, event.target.value);
  }

  setFormstate(key, value, interval) {
    this.state.formstate[key] = value;
    this.setState({formstate: this.state.formstate});

  }

  onPasteImage(e) {
    var content = e.target.value;
    var img = new Image();
    img.onload = () => {
      this.setFormstate('imgsrc', content, 1000);
    };

    img.onerror = () => {
      this.setFormstate('imgsrc', null);
    }
    img.src = content;
  }

  timeChange(e) {
    if (!isNaN(e)) {
      var fs = this.state.formstate;
      fs.timestamp = e;
      this.setState({formstate: fs});
    } else {
      this.setFormstate('timestamp', null);
    }
  }

  isTimeValid() {
    var time = this.state.formstate.timestamp;
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

    let areaSelected = (loc, address) => {
      console.log('alue valittu', loc);
      let location = {lat: loc.lat(), lng: loc.lng()};
      this.state.formstate.location = location;
      this.state.formstate.address = address;
      this.setState({formstate: this.state.formstate});
    };

    const onClickNext = () => {
      let newActiveKey = this.state.activeKey + 1;
      this.setState({activeKey: newActiveKey});
    };
    const onSave = () => {
      this.setState({saving: true});
      $.ajax({
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        url: '/saveilmoita',
        data: JSON.stringify(this.state.formstate),
        success: _ => {
          this.setState({saving: false});
          window.location.replace("/kadonneet");
        }
      });
    };

    let handleSelect = (key) => {
      this.setState({activeKey: key})
    };
    return (
      <div className="row">
        <div className="col-md-12">
          <label className="control-label">Edistys</label>
          <ProgressBar now={ Math.round((correctCount / fields.length ) * 100)} label="%(percent)s%" bsStyle="success"/>
        </div>
        <div className="col-md-12">
          <Tabs activeKey={this.state.activeKey} onSelect={handleSelect}>

            <Tab eventKey={1} title="1. Nimi" tabIndex="-1">
              <div className="wizard-content">
                <Input tabIndex="1" type="text" name="name" onChange={this.handleTextChange}
                       placeholder="Syötä muodossa etunimi sukunimi"
                       label="Henkilön nimi"/>
                <Next disabled={!isNameValid} onClick={onClickNext}/>
              </div>
            </Tab>
            {isNameValid ?
              <Tab title="2. Tiedot" tabIndex="-1" eventKey={2}>
                <div className="wizard-content">
                  <Input type="textarea" autoFocus="true" tabIndex="2"
                         placeholder="Kuvaile kadonnutta mahdollisimman tarkasti" name="description"
                         label="Henkilön kuvaus" onChange={this.handleTextChange}
                    />
                </div>
                <Next disabled={!isDescriptionValid} onClick={onClickNext}/>

              </Tab> : ''}

            {isDescriptionValid ?
              <Tab title="3. Kuva" eventKey={3} tabIndex="-1">
                <div className="wizard-content">
                  <Input
                    type="text"
                    onBlur={this.onPasteImage} label="Kuva henkilöstä" className="form-control"
                    placeholder="Liitä kuva kadonneesta henkilöstä" hasFeedback/>
                  {this.state.formstate.imgsrc ?
                    <img src={this.state.formstate.imgsrc} className="thumbnail img-responsive"/>
                    : ''}
                </div>
                <Next disabled={!isImageValid} onClick={onClickNext}/>

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
                      <Map initialZoom={5} center={{lat: 63.612101,lng: 26.175575}} onArea={areaSelected}/>
                      <label><strong>{this.state.formstate.address}</strong></label>
                    </div>
                    : ''}
                </div>
                <Next disabled={!isMapValid} onClick={onClickNext}/>

              </Tab>
              : ''}

            {isFormValid ?
              <Tab title="5. Esikatselu" eventKey={5} tabIndex="-1">
                <div className="wizard-content">
                  <fieldset>
                    <legend>Tarkista lomakkeen tiedot</legend>
                    <form className="form-horizontal" id="confirm-form">
                      <FormControls.Static label="Henkilön nimi" value={this.state.formstate.name}
                                           labelClassName="col-md-3"
                                           wrapperClassName="col-md-9"/>
                      <FormControls.Static label="Henkilön kuvaus" value={this.state.formstate.description}
                                           labelClassName="col-md-3"
                                           wrapperClassName="col-md-8"/>

                      <div className="form-group">
                        <label className="control-label col-md-3">
                          <span>Kuva henkilöstä</span>
                        </label>

                        <div className="col-md-9">
                          <img className="thumbnail img-responsive" src={this.state.formstate.imgsrc}/>
                        </div>

                      </div>
                      <FormControls.Static label="Katoamisajankohta"
                                           value={this.formatTime(this.state.formstate.timestamp)}
                                           labelClassName="col-md-3"
                                           wrapperClassName="col-md-9"/>
                      <FormControls.Static label="Katoamispaikka" value={this.state.formstate.address}
                                           labelClassName="col-md-3"
                                           wrapperClassName="col-md-9"/>

                      <div className="btn-group pull-right">
                        <Button onClick={onSave} bsStyle="primary" bsSize="large">Ilmoita</Button>
                      </div>

                    </form>
                  </fieldset>
                  {this.state.saving ?
                    <Spinner dimm="confirm-form"/> : ''
                  }
                </div>

              </Tab> : ''}

          </Tabs>

        </div>
      </div>)
  }

  formatTime(timestamp) {
    let dt = new Date(timestamp * 1);
    let time = dt.getDate() + '.' + (dt.getMonth() + 1) + '.' + dt.getFullYear() + ' ' + dt.getHours() + ':' + dt.getMinutes();
    return time;
  }

}
KadonnutForm.defaultProps = {tilanteet: [{value: 1, label: 'Kadonnut'}]};

export default KadonnutForm;