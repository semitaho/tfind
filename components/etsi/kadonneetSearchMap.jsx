import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Modal,FormControls, Input} from 'react-bootstrap';

import Spinner from './../spinner.jsx';
import ItemUtils from './../../utils/itemutils.js';
import TextFormatter from './../../utils/textformatter.js';
import DateTimePicker from 'react-bootstrap-datetimepicker';
import UIUtils from './../../utils/uiutils.js';
import KadonneetMarker from './kadonneetMarker.jsx';
import KadonneetTracker from './kadonneetTracker.jsx';
import Map from './../map.jsx';

export default class KadonneetSearchMap extends React.Component {
  constructor() {
    super();
    this.gotLocation = this.gotLocation.bind(this);
    this.geocoder = new google.maps.Geocoder;

    this.startSearching = this.startSearching.bind(this);
    this.onErrorGeocoding = this.onErrorGeocoding.bind(this);
    this.markToMap = this.markToMap.bind(this);

    this.state = {opened: true, loading: false};
    this.polyline = new google.maps.Polyline({
      strokeColor: '#000000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
  }

  renderSpinner(prop) {
    return (<Spinner dimm={prop}/>)
  }

  renderQuestion() {
    return (<div>
              <h3>Valitse etsintätapa henkilöstä {this.props.item.name}</h3>
              <div className="center-block row">
                <div className="col-md-12 btn-toolbar">
                  <button type="button" className="btn btn-default btn-md" onClick={this.props.onclose}>Sulje</button>
                  <button type="button" className="btn btn-success btn-md" onClick={this.markToMap}>Merkitse karttaan</button>
                  <button type="button" className="btn btn-primary btn-md" onClick={this.startSearching}>Aloita jäljittäminen
                    (vaatii HTML5 geotunnisteen)
                  </button>
                </div>
              </div>
            </div>)

  }

  render() {
    var mapClass = this.state.opened === true ? 'grayable' : '';
    return (<Modal dialogClassName="search-modal" show={true} bsSize="large" onHide={this.props.onclose}>
      {this.state.opened === false && this.state.started === true?
        this.renderTracking() : ''}
   
      {this.state.opened === false && this.state.marking ? <KadonneetMarker position={this.state.katoamispaikka}  item={this.props.item} onclose={this.props.onclose} radius={this.state.radius} location={this.state.location} katoamisdistance={this.state.katoamisdistance} /> : ''}
      <Modal.Body>
        {this.state.opened === false && this.state.marking ? <Map id="kadonneet-search-map"  circle={{lat: this.state.katoamispaikka.lat, lng: this.state.katoamispaikka.lng}} katoamispaikka={this.state.katoamispaikka} /> : '' }
        {this.state.opened === true ?
          <div className="opened">
            {this.renderQuestion()}
            <Map id="kadonneet-search-map" className={mapClass} katoamispaikka={this.state.katoamispaikka} />
          </div> : ''}
        {this.state.loading ? this.renderSpinner("kadonneet-search-map") : ''}
      </Modal.Body>
    </Modal>)
  }

  renderTracking() {
    return <KadonneetTracker length={this.state.length} item={this.props.item} onclose={this.props.onclose} />
  }

  gotLocation(latlng) {
    this.setState({started: true, loading: false});
    if (!this.checkLatestPointsDistance(latlng.coords)) {
      return;
    }
    var position = this.updateMarker(latlng.coords);
    this.updateRoute(position);
    var length = this.calculateLength();
    this.setState({length: length});

  }

  calculateLength() {
    var length = google.maps.geometry.spherical.computeLength(this.polyline.getPath().getArray());
    return TextFormatter.formatMeters(length);
  }

  checkLatestPointsDistance(latlng) {
    var wholePath = this.polyline.getPath();
    if (wholePath.getArray().length <= 1) {
      return true;
    }
    var wholePath = this.polyline.getPath();
    var lastPointLng = wholePath.getAt(wholePath.getLength() - 1);
    let distance = google.maps.geometry.spherical.computeDistanceBetween(lastPointLng, new google.maps.LatLng(latlng.latitude, latlng.longitude));
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
    google.maps.event.removeListener(this.resizeListener);
    this.map = null;
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      console.log('watch cleared');
    }
  }

  initMap(coordinates) {
    let mapId = 'kadonneet-search-map';
    var mapOptions = {
      draggable: true,
      disableDefaultUI: true,
      scrollwheel: false,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
        style: google.maps.ZoomControlStyle.LARGE
      },
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      zoom: this.props.initialZoom,
      center: {lat: coordinates.latitude, lng: coordinates.longitude}
    };
    UIUtils.calculateModalMapHeight(mapId);

    var domNode = document.getElementById(mapId);
    this.map = new google.maps.Map(domNode, mapOptions);
    this.polyline.setMap(this.map);
  }

  onErrorGeocoding() {
    alert('geolocation not supported');
  }

  componentDidMount() {
    let loc = ItemUtils.findKatoamispaikkaLoc(this.props.item);
    this.initMap({latitude: loc.lat, longitude: loc.lng});
    this.resizeListener = google.maps.event.addDomListener(window, "resize", () => {
        let mapId = 'kadonneet-search-map';
        UIUtils.calculateModalMapHeight(mapId);
        let center = this.map.getCenter();
        let loc = ItemUtils.findKatoamispaikkaLoc(this.props.item);
        this.map.setCenter({lat: loc.lat, lng: loc.lng});
      });
 
  }

  startSearching() {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    this.watchId = navigator.geolocation.watchPosition(this.gotLocation, this.onErrorGeocoding, options);
    this.setState({opened: false, loading: true});
  }

  getKatoamispaikka() {
    let katoamisLoc = ItemUtils.findKatoamispaikkaLoc(this.props.item);
    return katoamisLoc;

  }

  markToMap() {
    let katoamisLoc = ItemUtils.findKatoamispaikkaLoc(this.props.item);
    this.setState({opened: false, marking: true, radius: this.state.radius, katoamispaikka: katoamisLoc});
    /*
    this.drawKatoamispaikka();
    this.updateMarker({latitude: katoamisLoc.lat, longitude: katoamisLoc.lng});

    this.state.radius = this.props.radius;

    this.drawCircle(this.marker.getPosition());
    this.updateLocation((this.marker.getPosition()));

    this.map.addListener('click', e => {
      console.log('e.', e.latLng);
      this.updateMarker({latitude: e.latLng.lat(), longitude: e.latLng.lng()});
      this.updateLocation(e.latLng);
      this.drawCircle(e.latLng);
    });


  */
  }

  componentDidUpdate(){
    console.log('cdu');
    UIUtils.calculateModalMapHeight('kadonneet-search-map');
  }

  updateLocation(latlng) {
    this.geocoder.geocode({'location': latlng}, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          let markerPosition = this.katoamis.getPosition();
          let distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(markerPosition.lat(), markerPosition.lng()), new google.maps.LatLng(latlng.lat(), latlng.lng()));
          this.setState({
            location: results[0].formatted_address,
            katoamisdistance: TextFormatter.formatMeters(distance)
          });
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
      editable: true,
      draggable: true
    });
    this.cityCircle.addListener('radius_changed', _ => {
      this.setState({radius: Math.round(this.cityCircle.getRadius())});
    });
    this.cityCircle.addListener('center_changed', _ => {
      var center = this.cityCircle.getCenter();
      this.updateMarker({latitude: center.lat(), longitude: center.lng()});
      this.updateLocation(center);
    });
  }
}

KadonneetSearchMap.defaultProps = {
  initialZoom: 12,
  radius: 500
};

