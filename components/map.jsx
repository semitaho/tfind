import React from 'react';
import ReactDOM from 'react-dom';

export default class Map extends React.Component{


  constructor(){
    super();
    this.map = null;
  }

  render(){
    return (
      <div id="map-havainnot"></div>
    );
  }

  componentDidMount(){
    var mapOptions = {draggable: false,disableDefaultUI: true, scrollWheel :false, mapTypeId: google.maps.MapTypeId.TERRAIN, zoom: this.props.initialZoom};

    this.map = new google.maps.Map(ReactDOM.findDOMNode(this), mapOptions);


  }

  componentDidUpdate(prevProps, prevState){
   // center: {lat: this.props.findings[0].lat, lng: this.props.findings[0].lon}
   // this.map.setCenter
   // this.map = new google.maps.Map(ReactDOM.findDOMNode(this), mapOptions);

  }

}

Map.defaultProps = {initialZoom: 10} ;