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