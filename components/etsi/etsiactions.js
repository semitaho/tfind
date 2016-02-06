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

export function changeAjankohta(timestamp){
  return {
    type: 'CHANGE_AJANKOHTA',
    timestamp
  };

}

export function doSaveMarking(){

  return (dispatch, getState) => {
    dispatch({type: 'LOAD_SPINNER'});


  };

}

export function saveMarking(){
  return (dispatch,getState) => {
    let state = getState();
    let confirmObject = {ajankohta: new Date().getTime(), name: state.etsistate.modal.item.name, location: state.mapstate.location, radius: state.mapstate.radius}
    return dispatch({type:'OPEN_SAVE_MARKING', confirmObject});
  }
}

export function cancelConfirmMarking(){
  return {
    type: 'OPEN_SAVE_MARKING',
    confirmObject: null
  };
}