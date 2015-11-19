import React from 'react';
import ReactDOM from 'react-dom';
import {Panel, Input, ProgressBar, Button,FormControls, Tabs, Tab} from 'react-bootstrap';
import $ from 'jquery';
import DateTimePicker from 'react-bootstrap-datetimepicker';
import Map from './map.jsx';
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

  isMapValid(){
    let location = this.state.formstate['location'];
    if (location && location.lat && location.lng){
      return true;
    }
    return false;
  }

  handleTextChange(event) {
    this.setFormstate(event.target.name, event.target.value);
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
    if (value !== null && value.length > 0){
      this.increaseIndex();
    }
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

  increaseIndex(){
   let activeKey = this.state.activeKey;
   let newActiveIndex = activeKey+1;
   this.setState({activeKey: newActiveIndex})
   this.setState({formstate: this.state.formstate});
    
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
    let isFormValid = isMapValid;

    let areaSelected = loc => {
      console.log('alue valittu', loc);
      let location = {lat:loc.lat(), lng: loc.lng()};
      this.state.formstate.location = location;
      this.state.activeKey +=1;
      this.setState(this.state);

    };

   
    const onSave = () => {

    };
    
    let handleSelect = (key) => {
      this.setState({activeKey:key})
    };
    return (
        

        <div className="row">
          <div className="col-md-12"> 
            <label className="control-label">Edistys</label>
            <ProgressBar now={this.getPercents()} label="%(percent)s%" bsStyle="success" />
          </div>
          <div className="col-md-12">
            <Tabs activeKey={this.state.activeKey} onSelect={handleSelect}>
              <Tab eventKey={1} title="1">
                  <Input tabIndex="1" type="text" name="name" onBlur={this.handleTextChange} placeholder="Syötä muodossa etunimi sukunimi"
                   label="Henkilön nimi" />
              </Tab>
        {isNameValid ?
          <Tab title="2" eventKey={2}>
           <Input type="textarea" autoFocus="true" tabIndex="2" placeholder="Kuvaile kadonnutta mahdollisimman tarkasti" name="description" label="Henkilön kuvaus" onBlur={this.handleTextChange}
                /> 
          </Tab> : ''}
       {isDescriptionValid ?    
          <Tab title="3" eventKey={3}>
            <div className='form-group'>
                <label className="control-label">Katoamisajankohta</label>
                  <DateTimePicker defaultText="" format="x"  size="sm"
                              inputFormat="D.M.YYYY H:mm"
                              onChange={this.timeChange} /> 
            </div>
          </Tab>
          : ''}
        {isTimeValid ?     
          <Tab title="4" eventKey={4}>
            <Input  
                    type="text" 
                    bsStyle={isImageValid ? 'success' : ''} 
                    onBlur={this.onPasteImage}  label="Kuva henkilöstä" className="form-control" placeholder="Liitä kuva kadonneesta henkilöstä" hasFeedback />
             {this.state.formstate.imgsrc ?          
            <img src={this.state.formstate.imgsrc}  className="thumbnail img-responsive" />
              : ''}
          </Tab>
          : '' }
       {isImageValid ?    
          <Tab title="5" eventKey={5}>
              <label className="control-label">Viimeisin havainto kartalla</label>
              <Map initialZoom={5} center={{lat: 63.612101,lng: 26.175575}} onArea={areaSelected} />
          </Tab>
          : ''}
          {true === true ?
         <Tab title="Esikatselu" eventKey={6}>
            <fieldset>
              <legend>Tarkista lomakkeen tiedot</legend>
             <form className="form-horizontal" id="confirm-form">
                <FormControls.Static label="Henkilön nimi" value={this.state.formstate.name} labelClassName="col-md-4"
                               wrapperClassName="col-md-8"/>
                <FormControls.Static label="Henkilön kuvaus" value={this.state.formstate.description} labelClassName="col-md-4"
                               wrapperClassName="col-md-8"/>
                <FormControls.Static label="Katoamisajankohta" value={this.state.formstate.timestamp} labelClassName="col-md-4"
                               wrapperClassName="col-md-8"/>
               </form>                
               </fieldset>
 
         </Tab> :''}
        </Tabs>
        
      </div></div>)
  }

}
KadonnutForm.defaultProps = {tilanteet: [{value: 1, label: 'Kadonnut'}]};

export default KadonnutForm;