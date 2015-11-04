import React from 'react';
import ReactDOM from 'react-dom';

export default class Map extends React.Component {


  constructor() {
    super();
    this.markers = [];
    this.map = null;
  }

  render() {
    return (
      <div id="map-havainnot"></div>
    );
  }

  componentDidMount() {
    var mapOptions = {
      draggable: false,
      disableDefaultUI: true,
      scrollwheel: false,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      zoom: this.props.initialZoom
    };
    mapOptions.center = this.calculateCenter(this.props.findings);
    this.map = new google.maps.Map(ReactDOM.findDOMNode(this), mapOptions);
    this.createMarkers();
    this.createRoute();
  }

  calculateCenter(findings) {
    var latSum = findings.reduce((prev, current, index, array) => {
      return current.lat + prev.lat;
    });
    var lngSum = findings.reduce((prev, current, index, array) => {
      return current.lng + prev.lng;
    });
    var finding = findings[findings.length - 1];
    return {lat: latSum / findings.length, lng: lngSum / findings.length};
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

  createRoute() {
    var lineSymbol = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
    };
    var path = this.props.findings.map(finding => {
      return {
        lat: finding.lat,
        lng: finding.lng
      };
    });
    var line = new google.maps.Polyline({
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
    console.log('desc', finding.description);
    var str = '<div class="thumbnail">' +
      '    <a target="_blank" href="' + finding.imgsrc + '"><img class="img-havainto" src="' + finding.imgsrc + '" /></a>' +
      '    <div class="caption"><h5>' + finding.description + '</h5><p>' + this.convertTimestampToTime(finding.timestamp) + '</p></div>';
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