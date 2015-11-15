import React from 'react';
import ReactDOM from 'react-dom';
import Panel from 'react-bootstrap/lib/Panel.js';
import Input from 'react-bootstrap/lib/Input.js';
import $ from 'jquery';

class KadonnutForm extends React.Component {
  constructor() {
    super();
    this.state = {formstate: {}};
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  componentDidMount() {
    console.log('on mount');
  }

  isValid(param) {
    var name = this.state.formstate[param];
    if (name !== null && name !== undefined && name.length > 0) {
      console.log('no ttur');
      return true;
    }
    return false;
  }

  checkSuccessStyle(property) {
    var style = this.isValid(property) ? "success" : "";
    return style;

  }

  handleTextChange(event) {
    console.log('ohhoh', event.target.name);
    this.state.formstate[event.target.name] = event.target.value;
    this.setState({formstate: this.state.formstate});

  }

  render() {
    var isNameValid = this.isValid("name");
    var showDescription = this.isValid(['name']);
    var showKellonaika = this.isValid(['name', 'description']);
    var isDescriptionValid = this.isValid("description");

    return (<Panel>
      <form>
        <Input type="text" name="name" onBlur={this.handleTextChange} placeholder="Syötä muodossa etunimi sukunimi"
               bsStyle={this.checkSuccessStyle("name")} label="Henkilön nimi" hasFeedback/>
        <Input type="textarea" name="description" label="Henkilön kuvaus" onBlur={this.handleTextChange}
               bsStyle={this.checkSuccessStyle("description")} labelClassName={!isNameValid ? 'hide' : ''}
               wrapperClassName={!isNameValid ? 'hide': ''} hasFeedback/>

        <Input type="select" name="type" label="Henkilön tilanne" labelClassName={!isDescriptionValid ? 'hide' : ''} wrapperClassName={!isDescriptionValid ? 'hide' : ''} hasFeedback>

        </Input>
      </form>
    </Panel>)
  }

}

export default KadonnutForm;