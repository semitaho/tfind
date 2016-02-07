import $ from 'jquery';

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

export function changeType(type){
  return {
    type: 'CHANGE_TYPE',
    result: type
  };
}

export function doSaveMarking(){
  return (dispatch, getState) => {
    dispatch({type: 'TOGGLE_SPINN', value:true});
    let dataobject = getState().etsistate.modal.confirmdialog;
    return $.ajax({
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        url: '/savemarking',
        data: JSON.stringify(dataobject),
        success: _ => {
          dispatch({type: 'TOGGLE_SPINN', value:false});
          dispatch(cancelConfirmMarking());
          dispatch(toggleEtsiModal(false));
        }      
    });
  };
}

export function saveMarking(){
  return (dispatch,getState) => {
    let state = getState();
    let confirmObject = {_id: state.etsistate.modal.item._id, searchResult: "1", ajankohtaTimestamp: new Date().getTime(), name: state.etsistate.modal.item.name, location: state.mapstate.location, latLng: state.mapstate.center, radius: state.mapstate.radius}
    return dispatch({type:'OPEN_SAVE_MARKING', confirmObject});
  }
}

export function cancelConfirmMarking(){
  return {
    type: 'OPEN_SAVE_MARKING',
    confirmObject: null
  };
}