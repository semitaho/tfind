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
    this.radiuschanged = this.radiuschanged.bind(this);
    this.onMapClick = this.onMapClick.bind(this);

    this.state = {loading: false, katoamisdistance: 0};
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
    var mapClass = this.props.opened === true ? 'grayable' : '';
    return (<Modal dialogClassName="search-modal" show={true} bsSize="large" onHide={this.props.onclose}>
      {this.props.opened === false && this.state.started === true ?
        this.renderTracking() : ''}

      {this.props.opened === false && this.props.marking ?
        <KadonneetMarker confirmdialogactions={this.props.confirmdialogactions} position={this.state.katoamispaikka} item={this.props.item} onclose={this.props.onclose}
                         radius={this.props.radius} location={this.props.location} confirmdialog={this.props.confirmdialog}
                         katoamisdistance={this.props.katoamisdistance}   /> : ''} 
      <Modal.Body>
        {this.props.opened === true ?
          <div>
            <div className="opened">
              {this.renderQuestion()}
            </div>
            <Map
              id="kadonneet-search-map"
              className={mapClass}
              center={this.state.center}
              />
          </div> : ''}
        {this.state.loading ? this.renderSpinner("kadonneet-search-map") : ''}
        {this.props.opened === false && this.props.marking ?
          <Map id="kadonneet-marker-map" className=""
               radius={this.props.radius}
               radiuschanged={this.radiuschanged}
               circle={this.props.circle}
               center={this.props.center}
               marker={this.props.marker}
               onmapclick={this.onMapClick}
               katoamispaikka={this.getKatoamispaikka()} /> : '' }
        {this.props.opened === false && this.state.started ?
          <Map id="kadonneet-tracker-map" center={this.state.center} marker={this.state.marker}
            /> : ''}
      </Modal.Body>
    </Modal>)
  }

  onMapClick(event) {
    this.props.onMapClick(event);
    console.log('on map click', event);
    /*
    let newClickPosition = {lat: event.latLng.lat(), lng: event.latLng.lng()};
    this.geocoder.geocode({'location': newClickPosition}, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          let distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.state.katoamispaikka.lat, this.state.katoamispaikka.lng), new google.maps.LatLng(newClickPosition.lat, newClickPosition.lng));
          this.setState({
            circle: newClickPosition,
            center: newClickPosition,
            marker: newClickPosition,
            location: results[0].formatted_address,
            katoamisdistance: TextFormatter.formatMeters(distance)
          });
        }
      }
    });
*/

  }

  renderTracking() {
    return <KadonneetTracker length={this.state.length} item={this.props.item} onclose={this.props.onclose}/>
  }

  gotLocation(latlng) {
    console.log('coords', latlng.coords);
    let position =  {lat: latlng.coords.latitude, lng: latlng.coords.longitude};
    this.setState({started: true, loading: false, center: position, marker: position});
    if (!this.checkLatestPointsDistance(latlng.coords)) {
      return;
    }
    /*

    this.updateRoute(position);
    var length = this.calculateLength();
    this.setState({length: length});
    */
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
    this.setState({loading: true});
  }

  getKatoamispaikka() {
    let katoamisLoc = ItemUtils.findKatoamispaikkaLoc(this.props.item);
    return katoamisLoc;

  }

  markToMap() {
    let katoamisLoc = ItemUtils.findKatoamispaikkaLoc(this.props.item);
    this.props.markToMap(this.props.radius, katoamisLoc); 
  
  }

  componentDidUpdate() {
    UIUtils.calculateModalMapHeight('kadonneet-search-map');
  }

  radiuschanged(radius) {
    console.log('ai radius');
    this.props.changeRadius(Math.round(radius));
  }

}

KadonneetSearchMap.defaultProps = {
  initialZoom: 12,
  radius: 500
};

