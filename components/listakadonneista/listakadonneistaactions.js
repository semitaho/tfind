
export function changeSearchCriteria(search){
  return {
    type: 'CHANGE_SEARCH_CRITERIA',
    search
  };
}


export function receiveTimeout(index, timeout){
  return {
    type: 'RECEIVE_TIMEOUT',
    index,
    timeout
  };
}