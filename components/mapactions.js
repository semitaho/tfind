import {toggleSpinner} from './spinneractions.js';
import TextFormatter from './../utils/textformatter.js';
export function receiveLocation(location){
  return {
    type: 'RECEIVE_LOCATION',
    location
  };
}

export function receiveAddress(address){
  return {
    type: 'RECEIVE_ADDRESS',
    address
  };
}

export function changeRadius(radius){
  return {
    type: 'CHANGE_RADIUS',
    radius
  };
}
export function receiveCircle(circle){
  return {
    type: 'RECEIVE_CIRCLE',
    circle
  };
}

export function onMapClick(event){

  let geocoder = new google.maps.Geocoder;
  return (dispatch, getState) => {
    let newClickPosition = {lat: event.latLng.lat(), lng: event.latLng.lng()};
    return geocoder.geocode({'location': newClickPosition}, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          let wanha = getState();
          if (wanha.mapstate && wanha.mapstate.katoamispaikka){
            let distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(wanha.mapstate.katoamispaikka.lat, wanha.mapstate.katoamispaikka.lng), new google.maps.LatLng(newClickPosition.lat, newClickPosition.lng));
            console.log('distance',distance)

            dispatch({type:'RECEIVE_KATOAMISDISTANCE', distance: TextFormatter.formatMeters(distance)});

          }


         // let distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.state.katoamispaikka.lat, this.state.katoamispaikka.lng), new google.maps.LatLng(newClickPosition.lat, newClickPosition.lng));
          dispatch({type: 'RECEIVE_CIRCLE', circle: newClickPosition});
          dispatch({type: 'RECEIVE_LOCATION', location: newClickPosition});
          dispatch({type: 'RECEIVE_MARKER', marker: newClickPosition});

          dispatch({type: 'RECEIVE_NAMED_LOCATION', location: results[0].formatted_address});
         
            /*
            circle: newClickPosition,
            center: newClickPosition,
            marker: newClickPosition,
            location: results[0].formatted_address,
            katoamisdistance: TextFormatter.formatMeters(distance)
          });
          */
        }
      }
    });
  }
}


export function selectArea(event){
  let geocoder = new google.maps.Geocoder;
  return (dispatch, getState) => {
    dispatch(toggleSpinner(true));
    return geocoder.geocode({'location': {lat: event.latLng.lat(), lng: event.latLng.lng()} }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            let location = {lat: event.latLng.lat(), lng: event.latLng.lng()};
            dispatch(receiveLocation(location));
            dispatch(receiveAddress(results[0].formatted_address));
            dispatch(receiveCircle(location));
            dispatch(changeRadius(getState().mapstate.radius));
            dispatch(toggleSpinner(false));

           // this.state.formstate.location = location;
//            this.state.formstate.address = 
          //  this.setState({formstate: this.state.formstate, circle: location, center: location});
          }
        }
    });
  };
}