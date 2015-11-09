import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-bootstrap/lib/Modal';


export default class KadonneetSearchMap extends React.Component{
  constructor(){
    super();
    this.gotLocation = this.gotLocation.bind(this);
    this.onErrorGeocoding = this.onErrorGeocoding.bind(this);
    this.state = {opened: true};
  }


  render(){
    var mapClass = this.state.opened ? 'grayable': '';
    return (<Modal show={true} bsSize="large">
      {this.state.opened ? <div className="opened">
                              <h3>Valmiina aloittamaan etsinnät henkilöstä {this.props.item.name}?</h3>
                              <button type="button" className="btn btn-default btn-lg" aria-label="Left Align">Sulje</button>
                              <button type="button" className="btn btn-primary btn-lg" aria-label="Left Align">Aloita</button>
                              

                            </div> : ''}
      <div id="kadonneet-search-map" className={mapClass} />
    </Modal>)
  }

  gotLocation(latlng){
    console.log('gotloc', latlng);
    this.initMap(latlng.coords);
    
  }

  initMap(coordinates){
    console.log(coordinates);
    var mapOptions = {
      draggable: false,
      scrollwheel: false,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      zoom: this.props.initialZoom,
      center: {lat: coordinates.latitude, lng: coordinates.longitude}
    };
    var domNode = document.getElementById('kadonneet-search-map');
    this.map = new google.maps.Map(domNode, mapOptions);

  }

  onErrorGeocoding(){
    alert('geolocation not supported');
  }

  componentDidMount() {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(this.gotLocation, this.onErrorGeocoding, options);

    console.log('on did mount');
    
    /*
    var center = this.calculateCenter(this.props.findings);
    console.log('center', center);
    mapOptions.center = center;
    */
  }
}


KadonneetSearchMap.defaultProps = {initialZoom: 14};

