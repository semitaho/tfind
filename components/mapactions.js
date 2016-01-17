import {toggleSpinner} from './spinneractions.js';
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