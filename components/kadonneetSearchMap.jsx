import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Modal,FormControls, Input} from 'react-bootstrap';

import Spinner from './spinner.jsx';
import ConfirmDialog from './modals/confirmDialog.jsx';
import DateTimePicker from 'react-bootstrap-datetimepicker';

export default class KadonneetSearchMap extends React.Component {
  constructor() {
    super();
    this.gotLocation = this.gotLocation.bind(this);
    this.geocoder = new google.maps.Geocoder;

    this.startSearching = this.startSearching.bind(this);
    this.onErrorGeocoding = this.onErrorGeocoding.bind(this);
    this.markToMap = this.markToMap.bind(this);
    this.cancelConfirmMarking = this.cancelConfirmMarking.bind(this);

    console.log('props', this.props);
    this.state = {opened: true, loading: true};
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
    return (<div><h3>Valitse etsintätapa henkilöstä {this.props.item.name}</h3>

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
    var mapClass = this.state.opened ? 'grayable' : '';
    return (<Modal dialogClassName="search-modal" show={true} bsSize="large" onHide={this.props.onclose}>
      {this.state.opened === false && this.state.started ?
        this.renderTracking() : ''}
      {this.state.opened === false && this.state.marking ?
        this.renderMarking() : ''}
      <Modal.Body>
        {this.state.opened ? <div className="opened">
          {this.state.loading ? this.renderSpinner("kadonneet-search-map") : this.renderQuestion()}
        </div> : ''}
        {
          this.state.saveMarking ? this.renderMarkingConfirm() : ''
        }
        <div id="kadonneet-search-map" className={mapClass}>

        </div>
      </Modal.Body>

    </Modal>)
  }

  renderMarking() {
    let confirmSaveMarking = _ => {
      var d = new Date();
      var n = d.getTime();
      this.setState({saveMarking: true, ajankohtaTimestamp: n});
    };

    return (<Modal.Header>
      <div className="row">
        <div className="col-md-8 col-xs-6 small">
          Etsitty kohteesta <strong>{this.state.location}</strong> säteellä {this.state.radius} m.
        </div>
        <div className="col-md-4 col-xs-6">
          <div className="btn-toolbar pull-right">
            <button onClick={this.props.onclose} className="btn btn-default">Sulje</button>
            <button onClick={confirmSaveMarking} className="btn btn-primary">Tallenna</button>
          </div>
        </div>
      </div>
    </Modal.Header>)
  }

  renderMarkingConfirm() {

    let ajankohtaChange = (val) => {
      console.log('vali is', val);
      this.setState({ajankohtaTimestamp: val});

    };

    let searchResultChange = (event) => {
      this.setState({searchResult: event.target.value});
    };

    let saveMarking = _ => {
      this.setState({saving: true});
      var saveobj = {
        _id: this.props.item._id,
        radius: this.state.radius,
        location: this.state.location,
        searchResult: this.state.searchResult,
        latLng: {
          lat: this.marker.getPosition().lat(),
          lng: this.marker.getPosition().lng()
        },
        ajankohtaTimestamp: this.state.ajankohtaTimestamp
      };
      $.ajax({
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        url: '/savemarking',
        data: JSON.stringify(saveobj),
        success: _ => {
          this.setState({saving: false,saveMarking: false});
          this.props.onclose();
        }
      });
    };
    return (

      <ConfirmDialog onHide={this.cancelConfirmMarking} onSave={saveMarking}>
        {this.state.saving ? this.renderSpinner('confirm-form') : '' }
        <form className="form-horizontal" id="confirm-form">
          <FormControls.Static label="Nimi" value={this.props.item.name} labelClassName="col-md-4"
                               wrapperClassName="col-md-8"/>
          <FormControls.Static label="Etsitty kohteesta" value={this.state.location} labelClassName="col-md-4"
                               wrapperClassName="col-md-8"/>
          <FormControls.Static label="Etsintäsäde" value={this.state.radius+' m'} labelClassName="col-md-4"
                               wrapperClassName="col-md-8"/>

          <div className="form-group">
            <label className="control-label col-md-4">
              Etsintäajankohta
            </label>

            <div className="col-md-8">
              <DateTimePicker format="x" ref="time"
                              inputFormat="D.M.YYYY H:mm"
                              onChange={ajankohtaChange}/>
            </div>
          </div>
          <Input type="select" labelClassName="col-md-4" wrapperClassName="col-md-8" label="Etsinnän tulos"
                 onChange={searchResultChange}
                 placeholder="1">
            {this.props.searchResults.map(item => {
              return (<option value={item.value}>{item.label}</option>)
            }) }
          </Input>

        </form>
      </ConfirmDialog>
    )
  }

  cancelConfirmMarking() {
    this.setState({saveMarking: false});
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

  gotLocation(latlng) {
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
    this.updateLocation(this.marker)
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
      editable: true,
      draggable: true
    });
    this.cityCircle.addListener('radius_changed', _ => {
      console.log('center', this.cityCircle.getRadius());
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
  radius: 500,
  searchResults: [{value: 1, label: 'Ei havaintoa'}, {value: 2, label: 'Löydetty elävänä'}, {
    value: 3,
    label: 'Löydetty kuolleena'
  }]
};

