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


  handleTextChange(event) {
    console.log('ohhoh', event.target.value);
    this.state.formstate[event.target.name] = event.target.value;
    this.setState({formstate: this.state.formstate});
  }

  render() {
    var isNameValid = this.isValid(["name"]);
    var isDescriptionValid = this.isValid(['name', 'description']);

    return (<Panel>
      <form>
        <Input type="text" name="name" onBlur={this.handleTextChange} placeholder="Syötä muodossa etunimi sukunimi"
               bsStyle={isNameValid ? 'success' : ''} label="Henkilön nimi" hasFeedback/>
        {isNameValid ?
        <Input type="textarea" name="description" label="Henkilön kuvaus" onBlur={this.handleTextChange}
               bsStyle={isDescriptionValid ? 'success' : ''}  hasFeedback /> : ''} 
        
         {isDescriptionValid ?       
            <Input type="select" name="type" label="Henkilön tilanne"  hasFeedback>
              {this.props.tilanteet.map(tilanne => {return <option value={tilanne.value}>{tilanne.label}</option> } ) }</Input> : ''}
      </form>
    </Panel>)
  }

}
KadonnutForm.defaultProps = {tilanteet: [{value: 1, label: 'Kadonnut'}]};

export default KadonnutForm;