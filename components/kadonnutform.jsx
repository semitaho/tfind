import React from 'react';
import ReactDOM from 'react-dom';
import {Panel, Input, ProgressBar, Button,FormControls} from 'react-bootstrap';
import $ from 'jquery';
import DateTimePicker from 'react-bootstrap-datetimepicker';
import Map from './map.jsx';
import ConfirmDialog from './modals/confirmDialog.jsx';
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

  isMapValid(){
    let location = this.state.formstate[location];
    if (location && location.lat && location.lng){
      return true;
    }
    return false;
  }

  handleTextChange(event) {
    this.state.formstate[event.target.name] = event.target.value;
    this.setState({formstate: this.state.formstate});
  }

  getPercents(){
    const length = 5;
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
      this.setFormstate('imgsrc', content);
    };

    img.onerror = () => {
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
    let isMapValid = this.isValid(['name','description', 'timestamp','imgsrc']) && this.isMapValid(); 
    let esikatseleClass = !isMapValid;

    let areaSelected = loc => {
      console.log('alue valittu', loc);
      let location = {lat:loc.lat(), lng: loc.lng()};
      this.setFormstate('location',location);

    };

    const onHide = () => {
      console.log('ok');
    };

    const onSave = () => {

    };
    
    return (<Panel>
         <ConfirmDialog onHide={onHide} onSave={onSave}>
           <form className="form-horizontal" id="confirm-form">
              <FormControls.Static label="Henkilön nimi" value="" labelClassName="col-md-4"
                               wrapperClassName="col-md-8"/>
              <FormControls.Static label="Henkilön kuvaus" value="" labelClassName="col-md-4"
                               wrapperClassName="col-md-8"/>
              <FormControls.Static label="Etsintäsäde" value="" labelClassName="col-md-4"
                                wrapperClassName="col-md-8"/>
            </form>
         </ConfirmDialog>
  
      <form>
        <Input tabIndex="1" type="text" name="name" onBlur={this.handleTextChange} placeholder="Syötä muodossa etunimi sukunimi"
               bsStyle={isNameValid ? 'success' : ''} label="Henkilön nimi" hasFeedback/>
        {isNameValid ?
        <Input type="textarea" autoFocus="true" tabIndex="2" placeholder="Kuvaile pylleröä" name="description" label="Henkilön kuvaus" onBlur={this.handleTextChange}
               bsStyle={isDescriptionValid ? 'success' : ''}  hasFeedback /> : ''} 
        {isDescriptionValid ?
        
        <div className='form-group'>
              <label className="control-label">Katoamisajankohta</label>
              <Input type="hidden" tabIndex="3" />
              <DateTimePicker defaultText="" format="x"  size="sm"
                              inputFormat="D.M.YYYY H:mm"
                              onChange={this.timeChange} /> </div> : ''}
       
         {isTimeValid ?  
            <div>
            <Input autoFocus="true" 
                    type="text" tabIndex="4" 
                    bsStyle={isImageValid ? 'success' : ''} 
                    onBlur={this.onPasteImage}  label="Kuva henkilöstä" className="form-control" placeholder="Liitä kuva kadonneesta henkilöstä" hasFeedback />
            {this.state.formstate.imgsrc ? <img src={this.state.formstate.imgsrc}  className="thumbnail img-responsive" /> : ''}</div> : ''}
         {isImageValid ? 
        <div className='form-group'>
           <label className="control-label">Viimeisin havainto kartalla</label>
            <Map initialZoom={5} center={{lat: 63.612101,lng: 26.175575}} onArea={areaSelected} />
          
        </div>    : ''
         }   
      </form>
      <div className="row">
        <div className="col-md-12">
          <button  className="btn pull-right btn-primary">Esikatsele</button>
        </div>
      </div>

      <hr/>

      <div className="row">
       <div className="col-md-12"> 
        <label className="control-label">Edistys</label>
        <ProgressBar now={this.getPercents()} label="%(percent)s%" bsStyle="success" />
        </div>
      </div>
    </Panel>)
  }

}
KadonnutForm.defaultProps = {tilanteet: [{value: 1, label: 'Kadonnut'}]};

export default KadonnutForm;