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
      scrollWheel: false,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      zoom: this.props.initialZoom
    };
    mapOptions.center = this.calculateCenter(this.props.findings);
    this.map = new google.maps.Map(ReactDOM.findDOMNode(this), mapOptions);
    this.createMarkers();
  }

  calculateCenter(findings) {
    var finding = findings[findings.length - 1];
    return {lat: finding.lat, lng: finding.lng};
  }


  createMarkers() {
    var self = this;
    this.props.findings.forEach(finding => {
        var marker = new google.maps.Marker({
          draggable: false,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5
          },
          position: {
            draggable: false,
            lat: finding.lat,
            lng: finding.lng
          },
          map: self.map
        });

        var infowindow = new google.maps.InfoWindow({
          content:  self.generateInfowindowContent(finding)
        });
        marker.addListener('click', e => {
          infowindow.open(self.map, marker);
        });

      }
    )
  }

  generateInfowindowContent(finding){
    console.log('desc', finding.description);
    var str = '<p>'+finding.description+'</p>';
    str += '<img class="img_responsive" src ="'+finding.imgsrc+'" />';
    return str;
  }


  componentDidUpdate(prevProps, prevState) {
    // center: {lat: this.props.findings[0].lat, lng: this.props.findings[0].lon}
    // this.map.setCenter
    // this.map = new google.maps.Map(ReactDOM.findDOMNode(this), mapOptions);

  }

}

Map.defaultProps = {initialZoom: 12};