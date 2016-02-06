export function toggleEtsiModal(isopen,item){
  return {
    type: 'TOGGLE_ETSI_MODAL',
    isopen,
    item
  }
}

export function markToMap(radius, location){
  return {
    type: 'MARK_TO_MAP',
    radius,
    location
  };
}

export function saveMarking(){
  return (dispatch,getState) => {
    console.log('saving marking....', getState());
    let state = getState();
    let confirmObject = {name: state.etsistate.modal.item.name, location: state.mapstate.location, radius: state.mapstate.radius}
    return dispatch({type:'OPEN_SAVE_MARKING', confirmObject});
  }
}

export function cancelConfirmMarking(){
  return {
    type: 'OPEN_SAVE_MARKING',
    confirmObject: null

  };
}