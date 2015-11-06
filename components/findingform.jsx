import React from 'react';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import DateTimePicker from 'react-bootstrap-datetimepicker';
export default class FindingForm extends React.Component {

  constructor() {
    super();
    this.state = {disabled: true, formstate: {description: '', timestamp: null}};
    this.findingChange = this.findingChange.bind(this);
    this.timeChange = this.timeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  findingChange(event) {
    let self = this;
    this.state.formstate.description = event.target.value;
    this.setState({formstate: this.state.formstate, disabled: !this.validate(self.state.formstate)});
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



  render() {
    return (
      <div className="panel panel-default">
      <div className="panel-heading">
        <h1>Ilmoita havainnosta</h1>
      </div>
      <div className="panel-body">
      <form method="POST"  noValidate>
        <Input id="finding" name="description" type="textarea" value={this.state.formstate.description} label="Havainto"
               onChange={this.findingChange} required="true" bsSize="large"
               placeholder="Kuvaa mahdollisimman tarkasti havaintoa kadonneesta."/>
        <div className="form-group form-group-lg">
          <label className="control-label">Ajankohta</label>
          <DateTimePicker name="timestamp" defaultText="" format="x" inputFormat="D.M.YYYY H:mm" onChange={this.timeChange}/>
        </div>
        <Input type="file" label="Kuva havaintopaikalta"/>
        <Button onClick={this.handleSubmit} bsStyle="primary" bsSize="large" disabled={this.state.disabled}>Ilmoita</Button>
      </form>
      </div>
      </div>  
    )
  }

  handleSubmit(){
    console.log('jepjep', this.state.formstate);
  }



}