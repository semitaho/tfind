import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-bootstrap/lib/Modal';


export default class KadonneetSearchMap extends React.Component{
  constructor(){
    super();
    this.gotLocation = this.gotLocation.bind(this);
    this.startSearching = this.startSearching.bind(this);
    this.onErrorGeocoding = this.onErrorGeocoding.bind(this);
    this.state = {opened: true};
  }


  render(){
    var mapClass = this.state.opened ? 'grayable': '';
    return (<Modal show={true} bsSize="large" onHide={this.props.onclose}>
              <Modal.Body>

      {this.state.opened ? <div className="opened">
                              <h3>Valmiina aloittamaan etsinnät henkilöstä {this.props.item.name}?</h3>
                              <div className="btn-group pull-right">
                                <button type="button" className="btn btn-default btn-lg" onClick={this.props.onclose}>Sulje</button>
                                <button type="button" className="btn btn-primary btn-lg" onClick={this.startSearching}>Aloita</button>
                              </div>
                            </div> : ''}
      <div id="kadonneet-search-map" className={mapClass} />
      </Modal.Body>
      {this.state.opened === false ?
      <Modal.Footer>
        <div className="btn-group">
          <button type="button" className="btn btn-default btn-lg" onClick={this.props.onclose}>Peruuta etsintä</button>
          <button type="button" className="btn btn-primary btn-lg">Tallenna</button>
          </div>
      </Modal.Footer> : ''}
    </Modal>)
  }

  gotLocation(latlng){
    console.log('gotloc', latlng);
    if (this.state.opened){
      this.initMap(latlng.coords);
    }
    this.updateMarker(latlng.coords);   
  }

  updateMarker(location){
    var marker = new google.maps.Marker({
      position: {lat:location.latitude, lng: location.longitude},
      map: this.map,
      title: 'Nykyinen sijainti'
    });
    this.map.setCenter(marker);
  }


  componentWillUnmount(){
    console.log('did un mount');
    this.map = null;
  }

  initMap(coordinates){
    console.log(coordinates);
    var mapOptions = {
      draggable: false,
      disableDefaultUI: true,
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
    this.watchId =  navigator.geolocation.watchPosition(this.gotLocation, this.onErrorGeocoding, options);

    console.log('on did mount');
    
    /*
    var center = this.calculateCenter(this.props.findings);
    console.log('center', center);
    mapOptions.center = center;
    */
  }
  startSearching(){
    this.setState({opened: false});

  }
}

KadonneetSearchMap.defaultProps = {initialZoom: 14};

