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
    var mapOptions = {draggable: false,disableDefaultUI: true,mapTypeId: google.maps.MapTypeId.TERRAIN, zoom: this.props.initialZoom, center: {lat: -34.397, lng: 150.644}};
    this.map = new google.maps.Map(ReactDOM.findDOMNode(this), mapOptions);


  }

}

Map.defaultProps = {initialZoom: 10};