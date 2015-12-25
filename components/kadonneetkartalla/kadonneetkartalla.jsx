import React from 'react';
import Map from './../map.jsx';
class KadonneetKartalla extends React.Component{
  render(){
    return <Map id="map-kadonneet" kadonneet={this.props.params.items} initialZoom={4} />
  }
}

export default KadonneetKartalla;