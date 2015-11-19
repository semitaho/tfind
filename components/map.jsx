import React from 'react';
import ReactDOM from 'react-dom';

class Map extends React.Component {

  constructor() {
    super();
    this.markers = [];
    this.map = null;
    this.createFindingMarker = this.createFindingMarker.bind(this);
  }

  render() {
    return (
      <div ref="map" id="map-havainnot"></div>
    );

  }

  componentDidMount() {
    this.geocoder = new google.maps.Geocoder;

    console.log('on did mount');
    var mapOptions = {
      draggable: false,
      scrollwheel: false,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      zoom: this.props.initialZoom
    };
    var domNode = ReactDOM.findDOMNode(this.refs.map);
    if (this.props.findings && this.props.findings.length > 0 ){
      let center = this.calculateCenter(this.props.findings);
      mapOptions.center = center;
      this.createMarkers();
      this.createRoute();
    } else if (this.props.center){
      console.log('center');
      mapOptions.center = this.props.center;
      google.maps.event.addDomListener(window, 'resize', ()  => {
        this.map.setCenter(this.props.center);
      });
    }
    this.map = new google.maps.Map(domNode, mapOptions);
    if (this.props.onClick) {
      google.maps.event.addListener(this.map, 'click', event => {
        console.log("Latitude: " + event.latLng.lat() + " " + ", longitude: " + event.latLng.lng());
        this.props.onClick(event.latLng);
        this.createFindingMarker({lat: event.latLng.lat(), lng: event.latLng.lng()});
      });
    }

    if (this.props.onArea){
      google.maps.event.addListener(this.map, 'click', event => {
        this.updateArea(event.latLng);
        this.updateLocation(event.latLng);
        this.props.onArea(event.latLng);
      }); 
    }
  }

  updateArea(location) {
    if (this.marker) {
      this.marker.setMap(null);
    }
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: 'Nykyinen sijainti'
    });
    console.log('marker', this.marker);
    this.map.setCenter(this.marker.getPosition());
    return this.marker.position;
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

  calculateCenter(findings) {
    if (findings.length === 0) {
      return {
        lat: 63.612101,
        lng: 26.175575
      };
    }
    if (findings.length == 1) {
      return {
        lat: findings[0].lat,
        lng: findings[0].lng
      };
    }
    var latSum = findings.reduce((prev, current, index, array) => {
      return current.lat + prev.lat;
    });
    var lngSum = findings.reduce((prev, current, index, array) => {
      return current.lng + prev.lng;
    });
    var finding = findings[findings.length - 1];
    return {lat: latSum / findings.length, lng: lngSum / findings.length};
  }

  createFindingMarker(latlng) {
    var markerIcon = {
      scale: 7,
      path: google.maps.SymbolPath.CIRCLE
    };

    if (this.findingMarker) {
      this.findingMarker.setMap(null);
    }

    this.findingMarker = new google.maps.Marker({
      draggable: false,
      icon: markerIcon,
      position: {
        lat: latlng.lat,
        lng: latlng.lng
      },
      map: this.map
    });

    this.createRoute(latlng);
  }

  createMarkers() {
    var self = this;

    var cross = {
      path: 'M 0,0 0,-8 0,0 -6,0 6,0 0,0 0,15 z',
      fillColor: 'yellow',
      fillOpacity: 0.8,
      scale: 1,
      strokeColor: 'black',
      strokeWeight: 3
    };

    this.props.findings.forEach(finding => {
        var markerIcon = null;
        switch (finding.type) {
          case 3:
            markerIcon = cross;
            break;
          default:
            markerIcon = {
              scale: 7,
              path: google.maps.SymbolPath.CIRCLE
            };
        }

        var marker = new google.maps.Marker({
          draggable: false,
          icon: markerIcon,
          position: {
            lat: finding.lat,
            lng: finding.lng
          },
          map: self.map
        });

        var infowindow = new google.maps.InfoWindow({
          content: self.generateInfowindowContent(finding)
        });
        marker.addListener('click', e => {
          self.map.setCenter({lat: finding.lat, lng: finding.lng});
          infowindow.open(self.map, marker);
        });

      }
    )
  }

  createRoute(latlng) {
    if (this.line) {
      this.line.setMap(null);
    }
    var lineSymbol = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
    };
    var path = this.props.findings.map(finding => {
      return {
        lat: finding.lat,
        lng: finding.lng
      };
    });

    if (latlng) {
      path.push(latlng);
    }
    this.line = new google.maps.Polyline({
      path: path,
      strokeOpacity: '0.5',
      icons: [{
        icon: lineSymbol,
        offset: '95%'
      }],
      map: this.map
    });

  }

  convertTimestampToTime(timestamp) {
    var dt = new Date(timestamp);
    console.log('dt', dt);
    var year = dt.getFullYear();
    var month = dt.getMonth() + 1;
    var day = dt.getDate();
    var hours = dt.getHours();
    var minutes = dt.getMinutes();
    return day + '.' + month + '.' + year + " klo " + hours + ":" + minutes;

  }

  generateInfowindowContent(finding) {
    var str = '<div class="thumbnail">';
    if (finding.imgsrc) {
      str += '    <a target="_blank" href="' + finding.imgsrc + '"><img class="img-havainto" src="' + finding.imgsrc + '" /></a>';
    }
    str += '<div class="caption"><h5>' + finding.description + '</h5><p>' + this.convertTimestampToTime(finding.timestamp) + '</p></div>';
    str += '</div>';
    return str;
  }

  componentDidUpdate(prevProps, prevState) {
    // center: {lat: this.props.findings[0].lat, lng: this.props.findings[0].lon}
    // this.map.setCenter
    // this.map = new google.maps.Map(ReactDOM.findDOMNode(this), mapOptions);

  }

}

Map.defaultProps = {initialZoom: 12};
export default Map;