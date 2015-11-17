import React from 'react';
import ReactDOM from 'react-dom';
import {Panel, Input, ProgressBar} from 'react-bootstrap';
import $ from 'jquery';
import DateTimePicker from 'react-bootstrap-datetimepicker';
import Map from './map.jsx';

class KadonnutForm extends React.Component {
  constructor() {
    super();
    this.state = {formstate: {}};
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

  handleTextChange(event) {
    this.state.formstate[event.target.name] = event.target.value;
    this.setState({formstate: this.state.formstate});
  }

  getPercents(){
    const length = 7;
    var valids = 0;

    for (var key in this.state.formstate){
      if (this.isValid([key])){
        valids++;
      }
    }
    return Math.round(valids/length * 100);

  }

  setFormstate(key,value){
    this.state.formstate[key] = value;
    this.setState({formstate: this.state.formstate});
  }

  onPasteImage(e){
    var content =  e.target.value;
    var img = new Image();
    img.onload = () => { 
      console.log('joo siel on kuva')
      this.setFormstate('imgsrc', content);
    };

    img.onerror = () => {
      console.log('se oli virhe')
      this.setFormstate('imgsrc', null);
    }
    img.src = content;
  }

  timeChange(e){
    if(!isNaN(e)){
      this.setFormstate('timestamp', e);
    } else {
      this.setFormstate('timestamp', null);
    }
  }

  render() {
    let isNameValid = this.isValid(["name"]);
    let isDescriptionValid = this.isValid(['name', 'description']);
    let isTimeValid = this.isValid(['name', 'description', 'timestamp'])
    let isImageValid = this.isValid(['name','description', 'timestamp','imgsrc']);

    return (<Panel>
      <form>
        <Input type="text" name="name" onBlur={this.handleTextChange} placeholder="Syötä muodossa etunimi sukunimi"
               bsStyle={isNameValid ? 'success' : ''} label="Henkilön nimi" hasFeedback/>
        {isNameValid ?
        <Input type="textarea"  name="description" label="Henkilön kuvaus" onBlur={this.handleTextChange}
               bsStyle={isDescriptionValid ? 'success' : ''}  hasFeedback /> : ''} 
        {isDescriptionValid ?
        <div className='form-group'>
              <label className="control-label">Katoamisajankohta</label>
              <DateTimePicker defaultText="" format="x" ref="time"
                              inputFormat="D.M.YYYY H:mm"
                              onChange={this.timeChange} /> </div> : ''}
       
         {isTimeValid ?  
            <div>
            <Input type="text" bsStyle={isImageValid ? 'success' : ''} onBlur={this.onPasteImage}  label="Kuva henkilöstä" className="form-control" placeholder="Liitä kuva kadonneesta henkilöstä" hasFeedback />
            {this.state.formstate.imgsrc ? <img src={this.state.formstate.imgsrc}  className="thumbnail img-responsive" /> : ''}</div> : ''}
         {isImageValid ? 
        <div className='form-group'>
           <label className="control-label">Viimeisin havainto kartalla</label>
           <div className="form-control">
            <Map initialZoom={5} findings={[{lat: 63.612101,lng: 26.175575, type:7}]} />
           </div>
        </div>    : ''
         }   
      </form>
      <hr />
      <div className="form-group">
      <label className="control-label">Edistys</label>
      <ProgressBar now={this.getPercents()} label="%(percent)s%" bsStyle="success" />
      </div>
   
    </Panel>)
  }

}
KadonnutForm.defaultProps = {tilanteet: [{value: 1, label: 'Kadonnut'}]};

export default KadonnutForm;