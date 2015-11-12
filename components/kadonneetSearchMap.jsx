import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-bootstrap/lib/Modal';
import Spinner from './spinner.jsx';


export default class KadonneetSearchMap extends React.Component {
  constructor() {
    super();
    this.gotLocation = this.gotLocation.bind(this);
    this.geocoder = new google.maps.Geocoder;

    this.startSearching = this.startSearching.bind(this);
    this.onErrorGeocoding = this.onErrorGeocoding.bind(this);
    this.markToMap = this.markToMap.bind(this);
    console.log('props', this.props);
    this.state = {opened: true, loading: true};
    this.polyline = new google.maps.Polyline({
      strokeColor: '#000000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
  }

  renderSpinner() {
    return (<Spinner dimm="kadonneet-search-map"/>)
  }

  renderQuestion() {
    return (<div><h3>Valitse etsintätapa henkilöstä {this.props.item.name}?</h3>

      <div className="btn-group center-block">
        <button type="button" className="btn btn-default btn-lg" onClick={this.props.onclose}>Sulje</button>
        <button type="button" className="btn btn-success btn-lg" onClick={this.markToMap}>Merkitse karttaan</button>
        <button type="button" className="btn btn-primary btn-lg" onClick={this.startSearching}>Aloita jäljittäminen
          (vaatii HTML5 geotunnisteen)
        </button>
      </div>
    </div>)

  }

  render() {
    var mapClass = this.state.opened ? 'grayable' : '';
    return (<Modal dialogClassName="search-modal" show={true} bsSize="large" onHide={this.props.onclose}>
      {this.state.opened === false && this.state.started ?
        this.renderTracking() : ''}
      {this.state.opened === false && this.state.marking ?
        this.renderMarking() : ''}
      <Modal.Body>
        {this.state.opened ? <div className="opened">
          {this.state.loading ? this.renderSpinner() : this.renderQuestion()}
        </div> : ''}
        <div id="kadonneet-search-map" className={mapClass}/>
      </Modal.Body>

    </Modal>)
  }

  renderTracking() {
    return (<Modal.Header>
      <div className="row">
        <div className="col-md-8 col-xs-6 small">
          Kuljettu matka {this.state.length} m.
        </div>
        <div className="col-md-4 col-xs-6">
          <div className="btn-group pull-right">
            <button type="button" className="btn btn-default btn-sm" onClick={this.props.onclose}>Peruuta etsintä
            </button>
            <button type="button" className="btn btn-primary btn-sm">Tallenna</button>
          </div>
        </div>
      </div>
    </Modal.Header>)
  }

  renderMarking() {
    return (<Modal.Header>
      <div className="row">
        <div className="col-md-8 col-xs-6 small">
          Etsitty kohteesta <strong>{this.state.location}</strong> säteellä {this.state.radius} m.
        </div>
      </div>
    </Modal.Header>)
  }

  gotLocation(latlng) {
    console.log('latlng', latlng.coords);
    if (this.state.opened) {
      this.initMap(latlng.coords);
    }
    if (!this.checkLatestPointsDistance(latlng.coords)) {
      return;
    }

    var position = this.updateMarker(latlng.coords);
    this.updateRoute(position);
    if (this.state.loading) {
      this.setState({loading: false});
    }
    var length = this.calculateLength();
    this.setState({length: length});
  }

  calculateLength() {
    var length = google.maps.geometry.spherical.computeLength(this.polyline.getPath().getArray());
    return length.toFixed(2);
  }

  checkLatestPointsDistance(latlng) {
    var wholePath = this.polyline.getPath();
    if (wholePath.getArray().length <= 1) {
      return true;
    }
    var wholePath = this.polyline.getPath();
    var lastPointLng = wholePath.getAt(wholePath.getLength() - 1);
    let distance = google.maps.geometry.spherical.computeDistanceBetween(lastPointLng, new google.maps.LatLng(latlng.latitude, latlng.longitude));
    console.log('distance', distance);
    if (distance < 10) {
      return false;
    }
    return true;
  }

  updateMarker(location) {
    if (this.marker) {
      this.marker.setMap(null);
    }
    var position = {lat: location.latitude, lng: location.longitude};
    this.marker = new google.maps.Marker({
      position: position,
      map: this.map,
      title: 'Nykyinen sijainti'
    });
    console.log('marker', this.marker);
    this.map.setCenter(this.marker.getPosition());
    return this.marker.position;
  }

  updateRoute(position) {
    var path = this.polyline.getPath();
    path.push(position);
    console.log('route', this.polyline.getPath().getLength());
  }

  componentWillUnmount() {
    console.log('did un mount');
    this.map = null;
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      console.log('watch cleared');
    }
  }

  initMap(coordinates) {
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
    this.polyline.setMap(this.map);
    console.log('pathlength initmap', this.polyline.getPath().getLength());

  }

  onErrorGeocoding() {
    alert('geolocation not supported');
  }

  componentDidMount() {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    this.watchId = navigator.geolocation.watchPosition(this.gotLocation, this.onErrorGeocoding, options);
    console.log('on did mount');
  }

  startSearching() {
    this.setState({opened: false, started: true});
  }

  markToMap() {
    this.state.radius = this.props.radius;
    this.drawCircle(this.marker.getPosition());
    this.updateLocation((this.marker.getPosition()));

    this.map.addListener('click', e => {
      console.log('e.', e.latLng);
      this.updateMarker({latitude: e.latLng.lat(), longitude: e.latLng.lng()});
      this.updateLocation(e.latLng);
      this.drawCircle(e.latLng);
    });

    this.setState({opened: false, marking: true, radius: this.state.radius});
  }

  updateLocation(latlng) {
    this.geocoder.geocode({'location': latlng}, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          this.setState({location: results[0].formatted_address});
        }
      }
    });
  }

  drawCircle(latlng) {
    if (this.cityCircle) {
      this.cityCircle.setMap(null);
    }
    this.cityCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.map,
      center: latlng,
      radius: this.state.radius,
      editable: true
    });
    this.cityCircle.addListener('radius_changed', _ => {
      console.log('center', this.cityCircle.getRadius());
      this.setState({radius: Math.round(this.cityCircle.getRadius())});
    });
  }
}

KadonneetSearchMap.defaultProps = {initialZoom: 14, radius: 1000};

