import React from 'react';
import Input from 'react-bootstrap/lib/Input';
import ButtonInput from 'react-bootstrap/lib/ButtonInput';
import DateTimePicker from 'react-bootstrap-datetimepicker';
export default class FindingForm extends React.Component{

  constructor(){
    super();
    this.state = {disabled: true, formstate: {description: ''}};
    this.findingChange = this.findingChange.bind(this);
  }

  findingChange(event){
    let self = this;
    this.state.formstate.description = event.target.value;
    this.setState({formstate: this.state.formstate, disabled: !this.validate(self.state.formstate)});
  }

  validate(formstate){
    var isValid = true;
    for (let key in formstate){
      let value = formstate[key];
      if (!value || 0 === value.length){
        return false;
      }
    }
    return isValid;
  
  }

  render(){
    return (
      <form noValidate>
        <Input id="finding" type="textarea" value={this.state.formstate.description} label="Havainto" onChange={this.findingChange} required="true" bsSize="large" placeholder="Kuvaa mahdollisimman tarkasti havaintoa kadonneesta." />
        <DateTimePicker format="x" />
        <Input type="file" label="Kuva havaintopaikalta"  />
        <ButtonInput type="submit" value="Ilmoita"  bsStyle="primary" bsSize="large" disabled={this.state.disabled}   />
      </form>
    )
  }
}