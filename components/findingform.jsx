import React from 'react';
import ReactDOM from 'react-dom';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import $ from 'jquery';
import Modal from 'react-bootstrap/lib/Modal';
import Map from './map.jsx';
import Spinner from './spinner.jsx';
import DateTimePicker from 'react-bootstrap-datetimepicker';
export default class FindingForm extends React.Component {

  constructor() {
    super();
    this.state = {showmodal: false, disabled: true, formstate: {description: '', timestamp: null}};
    this.findingChange = this.findingChange.bind(this);
    this.tyyppiChange = this.tyyppiChange.bind(this);
    this.timeChange = this.timeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
  }

  componentDidMount() {
    console.log('did mount...');
  }

  componentWillReceiveProps(nextProps) {
    this.setState({showmodal: nextProps.showmodal});
  }

  findingChange(event) {
    let self = this;
    this.state.formstate.description = event.target.value;
    this.setState({formstate: this.state.formstate, disabled: !this.validate(self.state.formstate)});
  }

  tyyppiChange(event) {
    let self = this;
    this.state.formstate.tyyppi = event.target.value;
    this.setState({formstate: this.state.formstate, disabled: !this.validate(self.state.tyyppi)});

  }

  validate(formstate) {
    var isValid = true;
    for (let key in formstate) {
      let value = formstate[key];
      if (!value || 0 === value.length) {
        return false;
      }
    }
    return isValid;
  }

  timeChange(time) {
    var formstate = this.state.formstate;
    formstate.timestamp = time;
    if (isNaN(time)) {
      this.setState({formstate: this.state.formstate, disabled: true});
      return;
    }
    this.setState({formstate: this.state.formstate, disabled: !this.validate(formstate)});
  }

  generateHideClass(property) {
    return this.state.formstate[property] == undefined || this.state.formstate[property] === null || this.state.formstate[property].length === 0 ? 'hide' : '';
  }

  canSubmit() {
    var formstate = this.state.formstate;
    var fields = ['description', 'tyyppi', 'lat', 'lng'];
    for (let i = 0; i < fields.length; i++) {
      let field = fields[i];
      if (formstate[field] === null || formstate[field] === undefined || formstate[field].length === 0) {
        return false;
      }
    }
    if (formstate.timestamp === null || formstate.timestamp === undefined || isNaN(formstate.timestamp)) {
      return false;
    }
    return true;
  }

  render() {

    var hideDescriptionClass = this.generateHideClass("tyyppi");
    var hideAjankohtaClass = this.generateHideClass('description');
    var hideMap = this.generateHideClass('timestamp') !== '' ? true : false;
    var hideSubmitClass = !this.canSubmit() ? 'hide' : '';
    return (

      <Modal id="modal" show={true} onHide={this.props.onclosemodal}>
        {this.state.loading ? <Spinner dimm="findingForm"/> : ''}
        <Modal.Header closeButton>
          <Modal.Title>Ilmoita uusi havainto henkilöstä {this.props.item.name}.</Modal.Title>
        </Modal.Header>

        <form method="POST" id="findingForm" action="/submitfinding" noValidate encType="multipart/form-data">
          <Modal.Body>
            <Input type="select" onChange={this.tyyppiChange} name="tyyppi" placeholder=""
                   label="Havainnon tyyppi">
              <option value="">Valitse</option>
              <option value="1">Nähty</option>
              <option value="2">Löydetty kuolleena</option>
              <option value="3">Ilmottautunut löydetyksi</option>

            </Input>
            <Input id="finding" labelClassName={hideDescriptionClass} wrapperClassName={hideDescriptionClass} ref="file"
                   name="description" type="textarea"
                   label="Havainto"
                   onChange={this.findingChange} required="true" bsSize="large"
                   placeholder="Kuvaa mahdollisimman tarkasti havaintoa kadonneesta."/>

            <div className={'form-group form-group-lg '+hideAjankohtaClass}>
              <label className="control-label">Ajankohta</label>
              <DateTimePicker inputProps={{name: 'ajankohta'}} defaultText="" format="x" ref="time"
                              inputFormat="D.M.YYYY H:mm"
                              onChange={this.timeChange}/>
              <input type="hidden" name="_id" value={this.props.item._id}/>
              <input type="hidden" name="lat" value={this.state.formstate.lat}/>
              <input type="hidden" name="lng" value={this.state.formstate.lng}/>
              <input type="hidden" name="timestamp" value={this.state.formstate.timestamp}/>
            </div>
            {hideMap ? '' : this.renderMap() }
          </Modal.Body>
          <Modal.Footer>
            <Button bsSize="large" onClick={this.props.onclosemodal}>Sulje</Button>
            <Button onClick={this.handleSubmit} bsStyle="primary" bsSize="large" className={hideSubmitClass}
                    disabled={this.state.disabled}>Ilmoita</Button>
          </Modal.Footer>
        </form>

      </Modal>

    )
  }

  renderMap() {
    return (
      <div className="form-group form-group-lg">
        <label>Havainto kartalla</label>
        <Map
          findings={this.props.item.findings == undefined || this.props.item.findings === null ? [] : this.props.item.findings}
          onClick={this.onMapClick}/>
      </div>)
  }

  onMapClick(location) {
    console.log('location', location);
    this.state.formstate.lat = location.lat();
    this.state.formstate.lng = location.lng();
    this.setState({formstate: this.state.formstate});

  }

  handleSubmit() {
    this.setState({loading: true});
    $('#findingForm').submit();
  }

}