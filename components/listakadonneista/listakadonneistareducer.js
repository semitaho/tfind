import havainnotkartalla from './havainnotkartallareducer.js';
import { combineReducers } from 'redux';


function search(state={}, action){
  if (action.type===  'CHANGE_SEARCH_CRITERIA'){
    return Object.assign({},state, {search: action.search});
  }
  return state;
}

function kadonneetitems(state={},action){
  switch(action.type){
    case 'RECEIVE_TIMEOUT':
      let newState = [
          ...state.slice(0, action.index),
          Object.assign({}, state[action.index], {
            timeout: action.timeout
          }),
          ...state.slice(action.index + 1)
        ];
      return newState;  
    default:
      return state;  
  }
  return state;
}

export default combineReducers({
  search,
  items: kadonneetitems,
  havainnotkartalla
});